import { db } from './firebase';
import { 
  doc, getDoc, updateDoc, addDoc, collection, getDocs, 
  serverTimestamp, query, where 
} from 'firebase/firestore';

// ============================================
// ===== معرف الجهاز (Device ID) =====
// ============================================

export const getDeviceId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('deviceId');
};

export const saveDeviceId = (deviceId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('deviceId', deviceId);
};

export const generateDeviceId = (): string => {
  return 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

// ============================================
// ===== بصمة الجهاز (Device Fingerprint) =====
// ============================================

export const getDeviceFingerprint = async () => {
  if (typeof window === 'undefined') {
    return {
      fingerprint: 'server-side',
      userAgent: 'server',
      platform: 'server'
    };
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency || '',
    navigator.deviceMemory || '',
    new Date().getTimezoneOffset()
  ];

  const fingerprint = components.join('|');

  return {
    fingerprint: fingerprint,
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'unknown'
  };
};

// ============================================
// ===== التحقق من صلاحية الجهاز =====
// ============================================

export const validateDeviceAccess = async (
  userId: string,
  deviceId: string,
  fingerprint: string
): Promise<{
  allowed: boolean;
  isFirstDevice: boolean;
  needsApproval: boolean;
  hasRequest: boolean;
  message: string;
}> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        allowed: false,
        isFirstDevice: false,
        needsApproval: false,
        hasRequest: false,
        message: 'المستخدم غير موجود'
      };
    }

    const userData = userDoc.data();
    const devices = userData.devices || [];

    console.log('📱 الأجهزة المسجلة:', devices);

    // ✅ الجهاز مسجل بالفعل ومعتمد
    const existingDevice = devices.find((d: any) => d.deviceId === deviceId);
    if (existingDevice) {
      console.log('📱 الجهاز موجود:', existingDevice);
      if (existingDevice.isApproved && existingDevice.status === 'approved') {
        return {
          allowed: true,
          isFirstDevice: false,
          needsApproval: false,
          hasRequest: false,
          message: 'جهاز معتمد'
        };
      } else if (existingDevice.status === 'pending') {
        return {
          allowed: false,
          isFirstDevice: false,
          needsApproval: true,
          hasRequest: true,
          message: 'هذا الجهاز في انتظار الموافقة من الأدمن'
        };
      } else {
        return {
          allowed: false,
          isFirstDevice: false,
          needsApproval: true,
          hasRequest: false,
          message: '⚠️ هذا الجهاز غير مصرح به. يرجى طلب إضافته.'
        };
      }
    }

    // ✅ أول جهاز (يتم الموافقة تلقائياً)
    if (devices.length === 0) {
      console.log('📱 أول جهاز للطالب');
      return {
        allowed: true,
        isFirstDevice: true,
        needsApproval: false,
        hasRequest: false,
        message: 'تسجيل أول جهاز'
      };
    }

    // ✅ جهاز جديد - التحقق من وجود طلب سابق
    const existingRequest = devices.find((d: any) => d.status === 'pending' && d.fingerprint === fingerprint);
    if (existingRequest) {
      return {
        allowed: false,
        isFirstDevice: false,
        needsApproval: true,
        hasRequest: true,
        message: 'تم إرسال طلب لهذا الجهاز مسبقاً، في انتظار الموافقة'
      };
    }

    // ✅ جهاز جديد - يحتاج موافقة
    console.log('📱 جهاز جديد يحتاج موافقة');
    return {
      allowed: false,
      isFirstDevice: false,
      needsApproval: true,
      hasRequest: false,
      message: '⚠️ هذا الجهاز غير مصرح به. يرجى طلب إضافته.'
    };

  } catch (error) {
    console.error('❌ خطأ في التحقق من الجهاز:', error);
    return {
      allowed: false,
      isFirstDevice: false,
      needsApproval: false,
      hasRequest: false,
      message: 'حدث خطأ في التحقق من الجهاز'
    };
  }
};

// ============================================
// ===== تسجيل أول جهاز (أو إضافة جهاز جديد معتمد) =====
// ============================================

export const registerFirstDevice = async (
  userId: string,
  deviceId: string,
  fingerprint: string,
  userAgent: string,
  platform: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const userData = userDoc.data();
    let devices = userData.devices || [];

    // ✅ التحقق: الجهاز موجود بالفعل
    const existingDevice = devices.find((d: any) => d.deviceId === deviceId);
    if (existingDevice) {
      if (existingDevice.isApproved && existingDevice.status === 'approved') {
        return { success: true, message: 'الجهاز معتمد بالفعل' };
      }
      if (existingDevice.status === 'pending') {
        return { success: false, message: 'هذا الجهاز في انتظار الموافقة' };
      }
    }

    // ✅ إذا كان أول جهاز → معتمد تلقائياً
    // ✅ إذا كان في أجهزة موجودة → نضيف الجهاز كـ pending
    const isFirstDevice = devices.length === 0;
    const isApproved = isFirstDevice;

    const newDevice = {
      deviceId: deviceId,
      fingerprint: fingerprint,
      userAgent: userAgent,
      platform: platform,
      isApproved: isApproved,
      isPrimary: isFirstDevice,
      status: isApproved ? 'approved' : 'pending',
      approvedAt: isApproved ? new Date().toISOString() : null,
      registeredAt: new Date().toISOString(),
    };

    // ✅ لو أول جهاز → استبدل القائمة
    if (isFirstDevice) {
      await updateDoc(userRef, {
        devices: [newDevice],
        deviceApproved: true,
        deviceId: deviceId,
        updatedAt: serverTimestamp(),
      });
      return { success: true, message: 'تم تسجيل الجهاز الأساسي بنجاح' };
    } else {
      // ✅ لو في أجهزة موجودة → أضف الجهاز الجديد كـ pending
      const existingPending = devices.find((d: any) => d.status === 'pending' && d.fingerprint === fingerprint);
      if (existingPending) {
        return { success: false, message: 'هذا الجهاز في انتظار الموافقة مسبقاً' };
      }

      await updateDoc(userRef, {
        devices: [...devices, newDevice],
        deviceApproved: false,
        updatedAt: serverTimestamp(),
      });

      // ✅ إشعار للأدمن
      await addDoc(collection(db, 'notifications'), {
        type: 'device_request',
        userId: userId,
        userName: userData.name || 'مستخدم',
        deviceId: deviceId,
        deviceInfo: {
          userAgent: userAgent,
          platform: platform,
          requestedAt: new Date().toISOString(),
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        readBy: [],
      });

      return { success: true, message: 'تم طلب إضافة الجهاز الجديد، في انتظار موافقة الأدمن' };
    }

  } catch (error) {
    console.error('❌ خطأ في تسجيل الجهاز:', error);
    return { success: false, message: 'حدث خطأ في تسجيل الجهاز' };
  }
};

// ============================================
// ===== طلب إضافة جهاز جديد =====
// ============================================

export const requestNewDevice = async (
  userId: string,
  deviceId: string,
  fingerprint: string,
  userAgent: string,
  platform: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const userData = userDoc.data();
    const devices = userData.devices || [];

    // ✅ التحقق من وجود طلب سابق
    const existingPending = devices.find((d: any) => d.status === 'pending' && d.fingerprint === fingerprint);
    if (existingPending) {
      return { success: false, message: 'هذا الجهاز في انتظار الموافقة مسبقاً' };
    }

    // ✅ التحقق من عدم وجود الجهاز معتمد
    const existingDevice = devices.find((d: any) => d.deviceId === deviceId);
    if (existingDevice) {
      if (existingDevice.isApproved && existingDevice.status === 'approved') {
        return { success: false, message: 'هذا الجهاز معتمد بالفعل' };
      }
      if (existingDevice.status === 'pending') {
        return { success: false, message: 'هذا الجهاز في انتظار الموافقة' };
      }
    }

    const newDeviceRequest = {
      deviceId: deviceId,
      fingerprint: fingerprint,
      userAgent: userAgent,
      platform: platform,
      isApproved: false,
      isPrimary: false,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
    };

    // ✅ إزالة أي أجهزة pending سابقة (نفس الـ fingerprint)
    const filteredDevices = devices.filter((d: any) => d.fingerprint !== fingerprint || d.status !== 'pending');
    
    await updateDoc(userRef, {
      devices: [...filteredDevices, newDeviceRequest],
      deviceApproved: false,
      updatedAt: serverTimestamp(),
    });

    // ✅ تسجيل الطلب في الـ notifications
    await addDoc(collection(db, 'notifications'), {
      type: 'device_request',
      userId: userId,
      userName: userData.name || 'مستخدم',
      deviceId: deviceId,
      deviceInfo: {
        userAgent: userAgent,
        platform: platform,
        requestedAt: new Date().toISOString(),
      },
      status: 'pending',
      createdAt: serverTimestamp(),
      readBy: [],
    });

    return { success: true, message: 'تم إرسال طلب إضافة الجهاز، في انتظار موافقة الأدمن' };

  } catch (error) {
    console.error('❌ خطأ في طلب إضافة الجهاز:', error);
    return { success: false, message: 'حدث خطأ في إرسال الطلب' };
  }
};

// ============================================
// ===== جلب deviceId من قاعدة البيانات =====
// ============================================

export const getDeviceIdFromDB = async (userId: string): Promise<string | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();
    const devices = userData.devices || [];
    const approvedDevice = devices.find((d: any) => d.isApproved === true && d.status === 'approved');
    
    return approvedDevice?.deviceId || null;
    
  } catch (error) {
    console.error('❌ خطأ في جلب deviceId:', error);
    return null;
  }
};

// ============================================
// ===== دوال الأدمن لإدارة الأجهزة =====
// ============================================

// ===== جلب جميع طلبات الأجهزة المعلقة =====
export const getPendingDeviceRequests = async (): Promise<any[]> => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const pendingRequests: any[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const devices = userData.devices || [];
      
      const pendingDevices = devices.filter((d: any) => d.status === 'pending');
      
      for (const device of pendingDevices) {
        pendingRequests.push({
          userId: userDoc.id,
          userName: userData.name || 'مستخدم',
          userPhone: userData.phone || '',
          deviceId: device.deviceId,
          fingerprint: device.fingerprint,
          userAgent: device.userAgent,
          platform: device.platform,
          requestedAt: device.requestedAt || device.registeredAt,
          status: device.status,
        });
      }
    }

    pendingRequests.sort((a, b) => {
      const dateA = new Date(a.requestedAt || 0);
      const dateB = new Date(b.requestedAt || 0);
      return dateB - dateA;
    });

    return pendingRequests;

  } catch (error) {
    console.error('❌ خطأ في جلب طلبات الأجهزة:', error);
    return [];
  }
};

// ===== الموافقة على جهاز =====
export const approveDevice = async (
  userId: string,
  deviceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const userData = userDoc.data();
    const devices = userData.devices || [];

    const updatedDevices = devices.map((d: any) => {
      if (d.deviceId === deviceId) {
        return {
          ...d,
          isApproved: true,
          status: 'approved',
          approvedAt: new Date().toISOString(),
        };
      }
      return d;
    });

    const approvedDevice = updatedDevices.find((d: any) => d.status === 'approved' && d.isApproved);
    const deviceApproved = approvedDevice !== undefined;

    await updateDoc(userRef, {
      devices: updatedDevices,
      deviceId: approvedDevice?.deviceId || deviceId,
      deviceApproved: deviceApproved,
      updatedAt: serverTimestamp(),
    });

    // ✅ إشعار للمستخدم
    await addDoc(collection(db, 'notifications'), {
      type: 'device_approved',
      userId: userId,
      title: '✅ تم الموافقة على جهازك',
      body: `تمت الموافقة على جهازك الجديد ويمكنك الآن الدخول من خلاله.`,
      readBy: [],
      createdAt: serverTimestamp(),
    });

    return { success: true, message: 'تمت الموافقة على الجهاز بنجاح' };

  } catch (error) {
    console.error('❌ خطأ في الموافقة على الجهاز:', error);
    return { success: false, message: 'حدث خطأ في الموافقة على الجهاز' };
  }
};

// ===== رفض جهاز =====
export const rejectDevice = async (
  userId: string,
  deviceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const userData = userDoc.data();
    const devices = userData.devices || [];

    const updatedDevices = devices.filter((d: any) => d.deviceId !== deviceId);

    await updateDoc(userRef, {
      devices: updatedDevices,
      updatedAt: serverTimestamp(),
    });

    // ✅ إشعار للمستخدم
    await addDoc(collection(db, 'notifications'), {
      type: 'device_rejected',
      userId: userId,
      title: '❌ تم رفض جهازك',
      body: `تم رفض جهازك الجديد، يمكنك التواصل مع الأدمن للمزيد من المعلومات.`,
      readBy: [],
      createdAt: serverTimestamp(),
    });

    return { success: true, message: 'تم رفض الجهاز' };

  } catch (error) {
    console.error('❌ خطأ في رفض الجهاز:', error);
    return { success: false, message: 'حدث خطأ في رفض الجهاز' };
  }
};

// ===== حذف جهاز =====
export const deleteDevice = async (
  userId: string,
  deviceId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    const userData = userDoc.data();
    const devices = userData.devices || [];

    const updatedDevices = devices.filter((d: any) => d.deviceId !== deviceId);

    await updateDoc(userRef, {
      devices: updatedDevices,
      updatedAt: serverTimestamp(),
    });

    return { success: true, message: 'تم حذف الجهاز بنجاح' };

  } catch (error) {
    console.error('❌ خطأ في حذف الجهاز:', error);
    return { success: false, message: 'حدث خطأ في حذف الجهاز' };
  }
};
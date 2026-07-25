// utils/deviceManager.ts
import { db } from '@/lib/firebase'
import { 
  collection, query, where, getDocs, 
  addDoc, updateDoc, doc, getDoc,
  serverTimestamp, deleteDoc 
} from 'firebase/firestore'

// ============================================
// 1. إنشاء Device ID جديد
// ============================================
export const generateDeviceId = (): string => {
  const random = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now().toString(36)
  return `dev_${random}_${timestamp}`
}

// ============================================
// 2. الحصول على Device ID من localStorage
// ============================================
export const getDeviceId = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('deviceId')
}

// ============================================
// 3. حفظ Device ID في localStorage
// ============================================
export const saveDeviceId = (deviceId: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('deviceId', deviceId)
}

// ============================================
// 4. مسح Device ID من localStorage
// ============================================
export const clearDeviceId = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('deviceId')
}

// ============================================
// 5. الحصول على بصمة الجهاز
// ============================================
export const getDeviceFingerprint = async (): Promise<{
  fingerprint: string
  userAgent: string
  platform: string
}> => {
  try {
    let fingerprint = 'unknown'
    
    try {
      const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      fingerprint = result.visitorId
    } catch (err) {
      const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      fingerprint = `${screenInfo}_${timezone}_${navigator.language}_${navigator.platform}`
    }

    return {
      fingerprint,
      userAgent: navigator.userAgent,
      platform: navigator.platform || 'unknown'
    }
  } catch (error) {
    console.error('Error getting fingerprint:', error)
    return {
      fingerprint: 'unknown',
      userAgent: navigator.userAgent,
      platform: navigator.platform || 'unknown'
    }
  }
}

// ============================================
// 6. الحصول على Device ID من قاعدة البيانات
// ============================================
export const getDeviceIdFromDB = async (userId: string): Promise<string | null> => {
  try {
    const devicesRef = collection(db, 'user_devices')
    const q = query(
      devicesRef,
      where('userId', '==', userId),
      where('isActive', '==', true),
      where('isPrimary', '==', true)
    )
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data()
      return data.deviceId
    }
    return null
  } catch (error) {
    console.error('Error getting device from DB:', error)
    return null
  }
}

// ============================================
// 7. التحقق من الجهاز أثناء تسجيل الدخول
// ============================================
export const validateDeviceAccess = async (
  userId: string,
  deviceId: string | null,
  fingerprint: string
): Promise<{
  allowed: boolean
  message: string
  deviceData?: any
  needsApproval?: boolean
  hasRequest?: boolean
  isFirstDevice?: boolean
}> => {
  try {
    if (!deviceId) {
      return {
        allowed: true,
        message: '✅ جهاز جديد، سيتم تسجيله تلقائياً',
        needsApproval: false,
        isFirstDevice: true
      }
    }

    const devicesRef = collection(db, 'user_devices')
    const q = query(
      devicesRef,
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return {
        allowed: true,
        message: '✅ أول دخول، سيتم تسجيل جهازك كجهاز أساسي',
        needsApproval: false,
        isFirstDevice: true
      }
    }

    let foundDevice = null
    let isValid = false
    let hasPendingRequest = false
    let hasActiveDevice = false

    snapshot.forEach(doc => {
      const data = doc.data()
      
      if (data.isActive === true) {
        hasActiveDevice = true
        if (data.deviceId === deviceId) {
          foundDevice = { id: doc.id, ...data }
          if (data.fingerprint && data.fingerprint !== 'unknown' && fingerprint !== 'unknown') {
            if (data.fingerprint === fingerprint) {
              isValid = true
            }
          } else {
            isValid = true
          }
        }
      }
      
      if (data.deviceId === deviceId && data.status === 'pending') {
        hasPendingRequest = true
        foundDevice = { id: doc.id, ...data }
      }
    })

    if (hasPendingRequest) {
      return {
        allowed: false,
        message: '⏳ طلب إضافة هذا الجهاز قيد المراجعة من قبل الأدمن',
        needsApproval: true,
        hasRequest: true,
        isFirstDevice: false
      }
    }

    if (foundDevice && isValid && foundDevice.isActive) {
      await updateDoc(doc(db, 'user_devices', foundDevice.id), {
        lastLogin: serverTimestamp()
      })
      return {
        allowed: true,
        message: '✅ تم التحقق من الجهاز بنجاح',
        deviceData: foundDevice,
        isFirstDevice: false
      }
    }

    if (hasActiveDevice) {
      return {
        allowed: false,
        message: '⚠️ جهاز جديد غير مسجل. يرجى طلب إضافة جهاز.',
        needsApproval: true,
        hasRequest: false,
        isFirstDevice: false
      }
    }

    return {
      allowed: true,
      message: '✅ سيتم تسجيل جهازك كجهاز أساسي',
      needsApproval: false,
      isFirstDevice: true
    }

  } catch (error) {
    console.error('Error validating device:', error)
    return {
      allowed: false,
      message: '❌ حدث خطأ في التحقق من الجهاز'
    }
  }
}

// ============================================
// 8. تسجيل أول جهاز للحساب
// ============================================
export const registerFirstDevice = async (
  userId: string,
  deviceId: string,
  fingerprint: string,
  userAgent: string,
  platform: string
): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const devicesRef = collection(db, 'user_devices')
    const q = query(
      devicesRef,
      where('userId', '==', userId),
      where('isActive', '==', true)
    )
    const snapshot = await getDocs(q)

    if (snapshot.size > 0) {
      return {
        success: false,
        message: '⚠️ يوجد جهاز مسجل بالفعل. يرجى طلب إضافة جهاز جديد.'
      }
    }

    await addDoc(collection(db, 'user_devices'), {
      userId,
      deviceId,
      fingerprint,
      userAgent,
      platform,
      deviceName: 'الجهاز الأساسي',
      isActive: true,
      isPrimary: true,
      status: 'approved',
      addedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp()
    })

    return {
      success: true,
      message: '✅ تم تسجيل جهازك الأساسي بنجاح'
    }

  } catch (error) {
    console.error('Error registering first device:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في تسجيل الجهاز'
    }
  }
}

// ============================================
// 9. طلب إضافة جهاز جديد
// ============================================
export const requestNewDevice = async (
  userId: string,
  deviceId: string,
  fingerprint: string,
  userAgent: string,
  platform: string
): Promise<{
  success: boolean
  message: string
  requestId?: string
}> => {
  try {
    const devicesRef = collection(db, 'user_devices')
    
    const q = query(
      devicesRef,
      where('userId', '==', userId),
      where('deviceId', '==', deviceId),
      where('status', '==', 'pending')
    )
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return {
        success: false,
        message: '⏳ يوجد طلب معلق لهذا الجهاز بالفعل'
      }
    }

    const activeQ = query(
      devicesRef,
      where('userId', '==', userId),
      where('deviceId', '==', deviceId),
      where('isActive', '==', true)
    )
    const activeSnapshot = await getDocs(activeQ)
    
    if (!activeSnapshot.empty) {
      return {
        success: false,
        message: '✅ هذا الجهاز مسجل بالفعل'
      }
    }

    const requestRef = await addDoc(collection(db, 'user_devices'), {
      userId,
      deviceId,
      fingerprint,
      userAgent,
      platform,
      deviceName: 'جهاز جديد (بإنتظار الموافقة)',
      isActive: false,
      isPrimary: false,
      status: 'pending',
      requestDate: serverTimestamp(),
      addedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    })

    return {
      success: true,
      message: '✅ تم إرسال طلب إضافة الجهاز، بإنتظار موافقة الأدمن',
      requestId: requestRef.id
    }

  } catch (error) {
    console.error('Error requesting new device:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في طلب إضافة الجهاز'
    }
  }
}

// ============================================
// 10. موافقة/رفض طلب جهاز
// ============================================
export const approveDeviceRequest = async (
  deviceId: string,
  approve: boolean
): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const deviceRef = doc(db, 'user_devices', deviceId)
    const deviceSnap = await getDoc(deviceRef)

    if (!deviceSnap.exists()) {
      return {
        success: false,
        message: '❌ الجهاز غير موجود'
      }
    }

    const data = deviceSnap.data()

    if (approve) {
      await updateDoc(deviceRef, {
        isActive: true,
        status: 'approved',
        approvedAt: serverTimestamp(),
        deviceName: 'جهاز إضافي',
        lastLogin: serverTimestamp()
      })
      return {
        success: true,
        message: '✅ تمت الموافقة على الجهاز بنجاح'
      }
    } else {
      await deleteDoc(deviceRef)
      return {
        success: true,
        message: '❌ تم رفض الجهاز وحذف الطلب'
      }
    }

  } catch (error) {
    console.error('Error approving device:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في معالجة الطلب'
    }
  }
}

// ============================================
// 11. الحصول على طلبات الأجهزة المعلقة - معدل
// ============================================
export const getPendingDeviceRequests = async (): Promise<{
  success: boolean
  requests?: any[]
  message?: string
}> => {
  try {
    const devicesRef = collection(db, 'user_devices')
    const q = query(
      devicesRef,
      where('status', '==', 'pending')
    )
    const snapshot = await getDocs(q)

    const requests: any[] = []
    for (const doc of snapshot.docs) {
      const data = doc.data()
      
      let studentName = 'غير معروف'
      let studentPhone = 'غير معروف'
      let studentGrade = 'غير محدد'
      
      try {
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            studentName = userData.name || 'غير معروف'
            studentPhone = userData.phone || 'غير معروف'
            studentGrade = userData.grade || 'غير محدد'
          } else {
            console.log(`❌ المستخدم ${data.userId} غير موجود`)
          }
        } else {
          console.log('❌ الطلب بدون userId:', doc.id)
        }
      } catch (e) {
        console.error('Error fetching user:', e)
      }

      requests.push({
        id: doc.id,
        ...data,
        studentName,
        studentPhone,
        studentGrade,
        requestDate: data.requestDate?.toDate?.() || data.requestDate,
        addedAt: data.addedAt?.toDate?.() || data.addedAt,
        lastLogin: data.lastLogin?.toDate?.() || data.lastLogin
      })
    }

    return {
      success: true,
      requests
    }

  } catch (error) {
    console.error('Error getting pending requests:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في جلب الطلبات'
    }
  }
}

// ============================================
// 12. الحصول على أجهزة المستخدم
// ============================================
export const getUserDevices = async (
  userId: string
): Promise<{
  success: boolean
  devices?: any[]
  message?: string
}> => {
  try {
    const devicesRef = collection(db, 'user_devices')
    const q = query(
      devicesRef,
      where('userId', '==', userId)
    )
    const snapshot = await getDocs(q)

    const devices: any[] = []
    snapshot.forEach(doc => {
      const data = doc.data()
      devices.push({
        id: doc.id,
        ...data,
        addedAt: data.addedAt?.toDate?.() || data.addedAt,
        lastLogin: data.lastLogin?.toDate?.() || data.lastLogin,
        requestDate: data.requestDate?.toDate?.() || data.requestDate
      })
    })

    return {
      success: true,
      devices
    }

  } catch (error) {
    console.error('Error getting user devices:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في جلب الأجهزة'
    }
  }
}

// ============================================
// 13. حذف جهاز
// ============================================
export const deleteDevice = async (
  deviceId: string,
  userId: string
): Promise<{
  success: boolean
  message: string
}> => {
  try {
    const deviceRef = doc(db, 'user_devices', deviceId)
    const deviceSnap = await getDoc(deviceRef)

    if (!deviceSnap.exists()) {
      return {
        success: false,
        message: '❌ الجهاز غير موجود'
      }
    }

    const data = deviceSnap.data()
    
    if (data.userId !== userId) {
      return {
        success: false,
        message: '❌ ليس لديك صلاحية حذف هذا الجهاز'
      }
    }

    if (data.isPrimary) {
      const devicesRef = collection(db, 'user_devices')
      const q = query(
        devicesRef,
        where('userId', '==', userId),
        where('isActive', '==', true)
      )
      const snapshot = await getDocs(q)
      
      if (snapshot.size <= 1) {
        return {
          success: false,
          message: '❌ لا يمكن حذف الجهاز الأساسي الوحيد'
        }
      }
    }

    await deleteDoc(deviceRef)

    return {
      success: true,
      message: '✅ تم حذف الجهاز بنجاح'
    }

  } catch (error) {
    console.error('Error deleting device:', error)
    return {
      success: false,
      message: '❌ حدث خطأ في حذف الجهاز'
    }
  }
}
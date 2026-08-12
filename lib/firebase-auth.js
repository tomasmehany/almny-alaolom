import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";

// نفس بيانات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBy-OhVURoXuK_C-cdNMYf_Uwe3hGA88E",
  authDomain: "tomas-service.firebaseapp.com",
  projectId: "tomas-service",
  storageBucket: "tomas-service.firebasestorage.app",
  messagingSenderId: "69137587894",
  appId: "1:69137587894:web:96ccaff83928b72cb49017"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// دالة تسجيل الدخول (معدلة لإضافة آخر دخول)
export async function loginUser(phone, password) {
  try {
    console.log('🔍 البحث عن مستخدم:', phone);
    
    // البحث عن الطالب في Firebase
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ لا يوجد مستخدم بهذا الرقم');
      return { success: false, error: "رقم الهاتف غير مسجل" };
    }
    
    // الحصول على بيانات المستخدم
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ وجد المستخدم:', userData.name);
    
    // التحقق من كلمة السر
    if (userData.password !== password) {
      return { success: false, error: "كلمة السر غير صحيحة" };
    }
    
    // التحقق من حالة الحساب
    if (userData.status !== 'active' && userData.status !== 'مفعل') {
      return { 
        success: false, 
        error: "الحساب قيد المراجعة. انتظر تفعيله من الادمن " 
      };
    }
    
    // تحديث آخر دخول في قاعدة البيانات
    try {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      console.log('✅ تم تحديث آخر دخول للطالب');
    } catch (updateError) {
      console.error('⚠️ فشل تحديث آخر دخول:', updateError);
    }
    
    // نجاح تسجيل الدخول
    return {
      success: true,
      user: {
        id: userDoc.id,
        name: userData.name,
        phone: userData.phone,
        grade: userData.grade,
        status: userData.status
      }
    };
    
  } catch (error) {
    console.error('🔥 خطأ في تسجيل الدخول:', error);
    return { success: false, error: "حدث خطأ في الخادم" };
  }
}

// دالة التحقق من جلسة المستخدم
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

// دالة تسجيل الخروج
export function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
}

export { db };
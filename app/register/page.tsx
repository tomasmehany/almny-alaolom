'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // حالة إظهار/إخفاء كلمة السر

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('🔄 جاري التحقق من البيانات...')
    
    try {
      // 1. نستورد Firebase
      const { db } = await import('@/lib/firebase')
      const { collection, addDoc, query, where, getDocs } = await import('firebase/firestore')
      
      // 2. نجيب البيانات من الفورم
      const form = e.target as HTMLFormElement
      const nameInput = form.querySelector('[name="name"]') as HTMLInputElement
      const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement
      const gradeSelect = form.querySelector('[name="grade"]') as HTMLSelectElement
      const passwordInput = form.querySelector('[name="password"]') as HTMLInputElement
      
      const userData = {
        name: nameInput?.value || 'مستخدم',
        phone: phoneInput?.value || '0000000000',
        grade: gradeSelect?.value || 'غير محدد',
        password: passwordInput?.value || '123456',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      // التحقق من صحة الرقم
      const phone = userData.phone.trim()
      if (!phone || phone.length < 10) {
        setMessage('❌ رقم الهاتف غير صحيح')
        setLoading(false)
        return
      }
      
      // 3. فحص إذا الرقم مسجل من قبل
      setMessage('🔍 جاري التحقق من رقم الهاتف...')
      
      const usersRef = collection(db, 'users')
      const phoneQuery = query(usersRef, where("phone", "==", phone))
      const querySnapshot = await getDocs(phoneQuery)
      
      if (!querySnapshot.empty) {
        setMessage('❌ رقم الهاتف هذا مسجل بالفعل')
        setLoading(false)
        // تظليل حقل الرقم
        if (phoneInput) {
          phoneInput.style.borderColor = '#ef4444'
          phoneInput.style.background = '#fee2e2'
          setTimeout(() => {
            phoneInput.style.borderColor = '#e5e7eb'
            phoneInput.style.background = '#f9fafb'
          }, 3000)
        }
        return
      }
      
      // 4. إذا الرقم جديد، نحفظ في Firebase
      setMessage('🔄 جاري إنشاء الحساب...')
      
      await addDoc(collection(db, 'users'), userData)
      
      // 5. نجاح
      setMessage('✅ تم التسجيل بنجاح! سيتم مراجعة طلبك من قبل الأدمن.')
      form.reset()
      
      // إظهار رسالة إضافية
      setTimeout(() => {
        setMessage('📞 سيتصل بك الأدمن قريباً للتفعيل')
      }, 2000)
      
    } catch (error: any) {
      console.error('Firebase error:', error)
      
      let errorMessage = '❌ حدث خطأ في التسجيل'
      if (error.code === 'permission-denied') {
        errorMessage = '❌ خطأ في الصلاحيات. تأكد من إعدادات Firebase'
      } else if (error.message.includes('already exists')) {
        errorMessage = '❌ رقم الهاتف مسجل بالفعل'
      }
      
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // دالة للتحقق من الرقم أثناء الكتابة
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    // إزالة أي مسافات أو رموز
    const cleaned = input.value.replace(/\D/g, '')
    input.value = cleaned
    
    // تنسيق الرقم تلقائياً
    if (cleaned.length > 0) {
      input.style.borderColor = '#10b981'
      input.style.background = '#f0fdf4'
    } else {
      input.style.borderColor = '#e5e7eb'
      input.style.background = '#f9fafb'
    }
  }

  // دالة إظهار/إخفاء كلمة السر
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // دالة للتواصل مع الأدمن على واتساب
  const contactAdmin = () => {
    const whatsappUrl = `https://wa.me/message/UKASWZCU5BNLN1?src=qr`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>إنشاء حساب جديد</h1>
          <p style={styles.subtitle}>انضم إلى المنصة التعليمية</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>الاسم بالكامل</label>
            <input
              type="text"
              name="name"
              placeholder="أدخل اسمك الثلاثي"
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              رقم التليفون
              <span style={styles.required}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="مثال: 01012345678"
              required
              minLength={10}
              maxLength={11}
              onChange={handlePhoneChange}
              style={styles.input}
            />
            <div style={styles.hint}>رقم الهاتف يجب ان يكون مرتبط بحساب واحد فقط</div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>السنة الدراسية</label>
            <select name="grade" required style={styles.input}>
              <option value="">اختر السنة الدراسية</option>
              <option value="1-prep">أولى إعدادي</option>
              <option value="2-prep">ثانية إعدادي</option>
              <option value="3-prep">ثالثة إعدادي</option>
              <option value="1-secondary">الصف الأول الثانوي</option>
              <option value="2-secondary">الصف الثاني الثانوي</option>
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>كلمة السر</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="6 أحرف على الأقل"
                required
                minLength={6}
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.passwordToggle}
                title={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
            <div style={styles.passwordHint}>
              {showPassword ? "كلمة السر مرئية" : "انقر على العين 👁️ لإظهار كلمة السر"}
            </div>
          </div>
          
          {/* زر تواصل مع الأدمن */}
          <div style={styles.contactSection}>
            <div style={styles.contactInfo}>
              <p style={styles.contactText}>للمساعدة:</p>
              <button 
                type="button"
                onClick={contactAdmin}
                style={styles.whatsappButton}
              >
                <span style={styles.whatsappIcon}>💬</span>
                تواصل مع الأدمن على واتساب
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? '🔄 جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>
        
        {message && (
          <div style={{
            ...styles.message,
            background: message.startsWith('✅') ? '#d4fae5' : 
                      message.startsWith('❌') ? '#fee2e2' : '#fef3c7',
            color: message.startsWith('✅') ? '#065f46' : 
                   message.startsWith('❌') ? '#991b1b' : '#92400e',
            borderColor: message.startsWith('✅') ? '#a7f3d0' : 
                        message.startsWith('❌') ? '#fecaca' : '#fde68a'
          }}>
            <div style={styles.messageIcon}>
              {message.startsWith('✅') ? '✅' : 
               message.startsWith('❌') ? '❌' : 
               message.startsWith('🔍') ? '🔍' : '🔄'}
            </div>
            <div>{message}</div>
          </div>
        )}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            لديك حساب بالفعل؟{' '}
            <a href="/login" style={styles.link}>سجل دخول</a>
          </p>
          <p style={{...styles.footerText, marginTop: '10px'}}>
            <a href="/" style={styles.link}>← الرجوع للرئيسية</a>
          </p>
        </div>
      </div>
    </div>
  )
}

// الأنماط
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    direction: 'rtl' as const
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '450px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
  },
  header: {
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    color: 'white',
    padding: '30px',
    textAlign: 'center' as const
  },
  title: {
    fontSize: '28px',
    marginBottom: '8px',
    fontWeight: 'bold' as const
  },
  subtitle: {
    fontSize: '16px',
    opacity: 0.9
  },
  form: {
    padding: '30px'
  },
  inputGroup: {
    marginBottom: '20px',
    position: 'relative' as const
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600' as const,
    color: '#333',
    fontSize: '14px'
  },
  required: {
    color: '#ef4444',
    marginRight: '4px'
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '5px',
    fontStyle: 'italic' as const
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    background: '#f9fafb',
    boxSizing: 'border-box' as const
  },
  // الأنماط الجديدة لحقل كلمة السر
  passwordContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },
  passwordInput: {
    width: '100%',
    padding: '14px 45px 14px 14px', // مساحة لزر العين
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    background: '#f9fafb',
    boxSizing: 'border-box' as const,
    fontFamily: 'Arial, sans-serif'
  },
  passwordToggle: {
    position: 'absolute' as const,
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '8px',
    color: '#6b7280',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.1)',
      borderRadius: '50%'
    }
  },
  passwordHint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '5px',
    textAlign: 'right' as const,
    fontStyle: 'italic' as const,
    minHeight: '18px'
  },
  contactSection: {
    margin: '25px 0',
    padding: '15px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd',
    textAlign: 'center' as const
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  contactText: {
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '600' as const,
    margin: 0
  },
  whatsappButton: {
    padding: '12px 20px',
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s',
    '&:hover': {
      background: '#128C7E',
      transform: 'translateY(-2px)'
    }
  },
  whatsappIcon: {
    fontSize: '20px'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px'
  },
  message: {
    margin: '20px 30px',
    padding: '15px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontWeight: '500' as const,
    border: '1px solid',
    animation: 'fadeIn 0.5s ease'
  },
  messageIcon: {
    fontSize: '20px',
    flexShrink: 0
  },
  footer: {
    textAlign: 'center' as const,
    padding: '25px 30px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  footerText: {
    color: '#666',
    fontSize: '15px'
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold' as const,
    textDecoration: 'none'
  }
}


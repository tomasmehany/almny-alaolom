'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/firebase-auth'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // تنظيف الرقم من أي حروف غير رقمية
    if (e.target.name === 'phone') {
      const cleaned = e.target.value.replace(/\D/g, '')
      setFormData({
        ...formData,
        [e.target.name]: cleaned
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // التحقق من صحة الرقم
    if (formData.phone.length < 10) {
      setError('❌ رقم الهاتف يجب أن يكون 10 أرقام على الأقل')
      setLoading(false)
      return
    }

    try {
      console.log('🚀 محاولة تسجيل الدخول...')
      
      const result = await loginUser(formData.phone, formData.password)
      
      if (result.success) {
        console.log('✅ تسجيل الدخول ناجح:', result.user)
        
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        
        // رسالة نجاح سريعة قبل التوجيه
        setError('✅ تم تسجيل الدخول بنجاح! جاري التوجيه...')
        
        // تأخير بسيط قبل التوجيه عشان المستخدم يشوف رسالة النجاح
        setTimeout(() => {
          window.location.href = '/platform'
        }, 1000)
        
      } else {
        setError(result.error || '❌ حدث خطأ في تسجيل الدخول')
        console.error('❌ خطأ تسجيل الدخول:', result.error)
      }
      
    } catch (error: any) {
      console.error('🔥 خطأ غير متوقع:', error)
      setError('❌ حدث خطأ في الخادم. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* عناصر خلفية زخرفية */}
      <div style={styles.bgCircle1}></div>
      <div style={styles.bgCircle2}></div>
      <div style={styles.bgCircle3}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <span style={styles.logoIcon}>🎓</span>
          </div>
          <h1 style={styles.title}>تسجيل الدخول</h1>
          <p style={styles.subtitle}>مرحباً بعودتك إلى علمني العلوم مع مستر بيشوي</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📱</span>
              رقم التليفون
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
              style={styles.input}
              dir="ltr"
              maxLength={11}
            />
            <div style={styles.hint}>
              ⓘ أدخل رقم الهاتف المسجل لدينا
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔐</span>
              كلمة السر
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                minLength={6}
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                title={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              >
                {showPassword ? "🔒" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              ...styles.errorBox,
              ...(error.includes('✅') && styles.successBox)
            }}>
              <span style={styles.errorIcon}>
                {error.includes('✅') ? '✅' : '⚠️'}
              </span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.button,
              ...(loading && styles.buttonLoading)
            }}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                جاري تسجيل الدخول...
              </span>
            ) : (
              <span style={styles.buttonContent}>
                <span>دخول إلى حسابي</span>
                <span style={styles.buttonIcon}>→</span>
              </span>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.footerRow}>
            <span style={styles.footerText}>ليس لديك حساب؟</span>
            <Link href="/register" style={styles.registerLink}>
              إنشاء حساب جديد
              <span style={styles.linkArrow}>←</span>
            </Link>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>أو</span>
          </div>

          {/* زر العودة للرئيسية - المطلوب */}
          <Link href="/" style={styles.homeLink}>
            <span style={styles.homeIcon}>🏠</span>
            العودة إلى الصفحة الرئيسية
          </Link>

          {/* رابط استعادة كلمة السر (اختياري) */}
          <div style={styles.forgotPassword}>
            <button 
              type="button"
              style={styles.forgotButton}
              onClick={() => {
                const whatsappUrl = `https://wa.me/message/UKASWZCU5BNLN1?src=qr`
                window.open(whatsappUrl, '_blank')
              }}
            >
              <span style={styles.forgotIcon}>❓</span>
              نسيت كلمة السر؟ تواصل مع الدعم
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

const styles: any = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #0b1120 0%, #1a1f35 50%, #1e1b4b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    direction: 'rtl',
    fontFamily: '"Cairo", "Segoe UI", Tahoma, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },

  bgCircle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    animation: 'pulse 8s ease-in-out infinite'
  },

  bgCircle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
    bottom: '-50px',
    left: '-50px',
    animation: 'pulse 10s ease-in-out infinite reverse'
  },

  bgCircle3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 12s ease-in-out infinite'
  },

  card: {
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    borderRadius: '32px',
    width: '100%',
    maxWidth: '480px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    position: 'relative',
    zIndex: 10,
    animation: 'fadeInUp 0.6s ease-out'
  },

  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
    color: 'white',
    padding: '40px 30px',
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden'
  },

  logoWrapper: {
    width: '70px',
    height: '70px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    animation: 'pulse 3s ease-in-out infinite'
  },

  logoIcon: {
    fontSize: '36px'
  },

  title: {
    fontSize: '32px',
    marginBottom: '10px',
    fontWeight: '800',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },

  subtitle: {
    fontSize: '16px',
    opacity: 0.95,
    fontWeight: '500'
  },

  form: {
    padding: '35px'
  },

  inputGroup: {
    marginBottom: '25px'
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '14px'
  },

  labelIcon: {
    fontSize: '16px'
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '15px',
    transition: 'all 0.3s',
    background: '#f9fafb',
    boxSizing: 'border-box' as const,
    outline: 'none',
    '&:focus': {
      borderColor: '#2563eb',
      background: '#ffffff',
      boxShadow: '0 0 0 4px rgba(37,99,235,0.1)'
    }
  },

  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },

  passwordContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },

  passwordInput: {
    width: '100%',
    padding: '14px 45px 14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    fontSize: '15px',
    transition: 'all 0.3s',
    background: '#f9fafb',
    boxSizing: 'border-box' as const,
    outline: 'none',
    '&:focus': {
      borderColor: '#2563eb',
      background: '#ffffff',
      boxShadow: '0 0 0 4px rgba(37,99,235,0.1)'
    }
  },

  passwordToggle: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    padding: '8px',
    color: '#6b7280',
    borderRadius: '12px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      background: 'rgba(37, 99, 235, 0.1)',
      color: '#2563eb'
    }
  },

  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '15px 20px',
    borderRadius: '16px',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500',
    animation: 'fadeInUp 0.3s ease'
  },

  successBox: {
    background: '#ecfdf5',
    borderColor: '#a7f3d0',
    color: '#065f46'
  },

  errorIcon: {
    fontSize: '20px',
    flexShrink: 0
  },

  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '10px',
    boxShadow: '0 10px 20px rgba(37,99,235,0.3)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 30px rgba(37,99,235,0.4)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  },

  buttonLoading: {
    opacity: 0.8,
    cursor: 'not-allowed',
    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    boxShadow: 'none'
  },

  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },

  buttonIcon: {
    fontSize: '20px',
    transition: 'transform 0.3s'
  },

  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },

  footer: {
    padding: '25px 35px 35px',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc'
  },

  footerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '15px'
  },

  footerText: {
    color: '#4b5563',
    fontSize: '15px'
  },

  registerLink: {
    color: '#2563eb',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
    '&:hover': {
      gap: '8px',
      color: '#7c3aed'
    }
  },

  linkArrow: {
    fontSize: '18px'
  },

  divider: {
    position: 'relative' as const,
    textAlign: 'center' as const,
    margin: '20px 0'
  },

  dividerText: {
    background: '#f8fafc',
    padding: '0 15px',
    color: '#94a3b8',
    fontSize: '14px',
    position: 'relative' as const,
    zIndex: 2
  },

  // زر العودة للرئيسية (المطلوب)
  homeLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    padding: '12px',
    borderRadius: '16px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    marginBottom: '15px',
    '&:hover': {
      color: '#2563eb',
      background: '#f1f5f9',
      borderColor: '#2563eb',
      transform: 'translateY(-2px)'
    }
  },

  homeIcon: {
    fontSize: '18px'
  },

  forgotPassword: {
    textAlign: 'center' as const
  },

  forgotButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '0 auto',
    padding: '8px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#2563eb',
      background: '#f1f5f9'
    }
  },

  forgotIcon: {
    fontSize: '16px'
  }
}

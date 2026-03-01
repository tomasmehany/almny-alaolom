'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/firebase-auth'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (formData.phone.length < 11) {
      setError('❌ رقم الهاتف يجب أن يكون 11 رقم')
      setLoading(false)
      return
    }

    try {
      console.log('🚀 محاولة تسجيل الدخول...')
      
      const result = await loginUser(formData.phone, formData.password)
      
      if (result.success) {
        console.log('✅ تسجيل الدخول ناجح:', result.user)
        
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        
        setError('✅ تم تسجيل الدخول بنجاح! جاري التوجيه...')
        
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

  const contactAdmin = () => {
    const whatsappUrl = `https://wa.me/message/UKASWZCU5BNLN1?src=qr`
    window.open(whatsappUrl, '_blank')
  }

  if (!mounted) return null

  return (
    <div className="container">
      {/* خلفية متحركة */}
      <div className="background"></div>
      <div className="backgroundOverlay"></div>
      
      {/* المحتوى الرئيسي */}
      <div className="content">
        {/* الجهة اليمنى - صورة الولد */}
        <div className="rightPanel">
          <div className="imageWrapper">
            <div className="imageContainer">
              <img 
                src="/images/boy-login.png" 
                alt="Student" 
                className="image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="imageFallback">
                <span className="fallbackIcon">👨‍🎓</span>
              </div>
            </div>
            
            <div className="welcomeText">
              <h2 className="welcomeTitle">مرحباً بعودتك!</h2>
              <h1 className="platformName">علمني العلوم</h1>
              <p className="welcomeMessage">مع مستر بيشوي، رحلتك نحو التفوق مستمرة</p>
            </div>

            <div className="quickLinks">
              <Link href="/register" className="quickLink">
                <span className="quickIcon">✨</span>
                <span>مشترك جديد؟</span>
              </Link>
              <button onClick={contactAdmin} className="quickLink">
                <span className="quickIcon">💬</span>
                <span>تواصل مع الأدمن</span>
              </button>
            </div>
          </div>
        </div>

        {/* الجهة اليسرى - نموذج تسجيل الدخول */}
        <div className="leftPanel">
          <div className="formCard">
            <div className="formHeader">
              <h2 className="formTitle">تسجيل الدخول</h2>
              <p className="formSubtitle">أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              {/* حقل رقم التليفون */}
              <div className="inputGroup">
                <label className="label">
                  <span className="labelIcon">📱</span>
                  رقم التليفون
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  required
                  className="input"
                  dir="ltr"
                  maxLength={11}
                />
                <span className="hint">أدخل 11 رقم (مثال: 01012345678)</span>
              </div>

              {/* حقل كلمة السر */}
              <div className="inputGroup">
                <label className="label">
                  <span className="labelIcon">🔐</span>
                  كلمة السر
                </label>
                <div className="passwordWrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="●●●●●●●●"
                    required
                    minLength={6}
                    className="passwordInput"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="passwordToggle"
                  >
                    {showPassword ? "🔒" : "👁️"}
                  </button>
                </div>
              </div>

              {/* ملحوظة نسيت كلمة السر */}
              <div className="forgotHint">
                <span className="forgotIcon">❓</span>
                <span>نسيت كلمة السر؟ تواصل مع الأدمن على واتساب</span>
              </div>

              {/* رسائل الخطأ/النجاح */}
              {error && (
                <div className={`message ${error.includes('✅') ? 'messageSuccess' : 'messageError'}`}>
                  <span className="messageIcon">
                    {error.includes('✅') ? '✅' : '⚠️'}
                  </span>
                  <span>{error}</span>
                </div>
              )}

              {/* زر تسجيل الدخول */}
              <button
                type="submit"
                className={`submitButton ${loading ? 'submitButtonLoading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="buttonContent">
                    <span className="spinner"></span>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  <span className="buttonContent">
                    <span>دخول إلى حسابي</span>
                    <span className="buttonArrow">←</span>
                  </span>
                )}
              </button>
            </form>

            {/* الفوتر */}
            <div className="footer">
              <div className="loginRow">
                <span className="loginText">ليس لديك حساب؟</span>
                <Link href="/register" className="loginLink">
                  إنشاء حساب جديد
                </Link>
              </div>

              <Link href="/" className="homeLink">
                <span className="homeIcon">🏠</span>
                <span>العودة للصفحة الرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: "Cairo", "Segoe UI", Tahoma, sans-serif;
          direction: rtl;
        }

        .background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(-45deg, #0b1120, #1a1f35, #1e1b4b, #0f172a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          z-index: 0;
        }

        .backgroundOverlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(37,99,235,0.15) 0%, transparent 60%);
          z-index: 1;
        }

        .content {
          position: relative;
          z-index: 2;
          display: flex;
          min-height: 100vh;
        }

        /* ========== الجهة اليمنى ========== */
        .rightPanel {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          animation: fadeIn 0.8s ease-out;
        }

        .imageWrapper {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .imageContainer {
          position: relative;
          margin-bottom: 30px;
          animation: float 6s ease-in-out infinite;
        }

        .image {
          width: 100%;
          max-width: 450px;
          margin: 0 auto;
          display: block;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.3));
        }

        .imageFallback {
          width: 300px;
          height: 300px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 30px 40px rgba(0,0,0,0.3);
        }

        .fallbackIcon {
          font-size: 120px;
        }

        .welcomeText {
          margin-bottom: 30px;
          color: white;
        }

        .welcomeTitle {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 5px;
          opacity: 0.9;
        }

        .platformName {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcomeMessage {
          font-size: 18px;
          opacity: 0.8;
          line-height: 1.6;
        }

        .quickLinks {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .quickLink {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
        }

        .quickLink:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .quickIcon {
          font-size: 18px;
        }

        /* ========== الجهة اليسرى ========== */
        .leftPanel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .formCard {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .formHeader {
          text-align: center;
          margin-bottom: 30px;
        }

        .formTitle {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .formSubtitle {
          font-size: 16px;
          color: #6b7280;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inputGroup {
          margin-bottom: 5px;
        }

        .label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .labelIcon {
          font-size: 16px;
        }

        .required {
          color: #ef4444;
          margin-right: 4px;
          font-size: 16px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s;
          background: #f9fafb;
          outline: none;
          box-sizing: border-box;
        }

        .input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }

        .input::placeholder {
          color: #9ca3af;
        }

        .hint {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 6px;
        }

        .passwordWrapper {
          position: relative;
        }

        .passwordInput {
          width: 100%;
          padding: 14px 45px 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s;
          background: #f9fafb;
          outline: none;
          box-sizing: border-box;
        }

        .passwordInput:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }

        .passwordToggle {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .passwordToggle:hover {
          color: #2563eb;
        }

        .forgotHint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
          margin-top: -5px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .forgotHint:hover {
          color: #2563eb;
        }

        .forgotIcon {
          font-size: 14px;
        }

        .message {
          padding: 15px 20px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          border: 1px solid;
          animation: fadeIn 0.3s ease;
        }

        .messageSuccess {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #065f46;
        }

        .messageError {
          background: #fef2f2;
          border-color: #fecaca;
          color: #991b1b;
        }

        .messageIcon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .submitButton {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
          box-shadow: 0 10px 20px rgba(37,99,235,0.3);
        }

        .submitButton:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(37,99,235,0.4);
        }

        .submitButton:active:not(:disabled) {
          transform: translateY(0);
        }

        .submitButton:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
        }

        .submitButtonLoading {
          opacity: 0.8;
        }

        .buttonContent {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .buttonArrow {
          font-size: 20px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .footer {
          margin-top: 25px;
          text-align: center;
        }

        .loginRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .loginText {
          color: #4b5563;
          font-size: 15px;
        }

        .loginLink {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
          font-size: 15px;
          transition: all 0.2s;
        }

        .loginLink:hover {
          color: #7c3aed;
          text-decoration: underline;
        }

        .homeLink {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 10px;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .homeLink:hover {
          color: #2563eb;
          background: #f1f5f9;
        }

        .homeIcon {
          font-size: 16px;
        }

        /* ========== MEDIA QUERIES للموبايل ========== */
        @media (max-width: 968px) {
          .content {
            flex-direction: column;
          }

          .rightPanel {
            padding: 30px 20px;
          }

          .leftPanel {
            padding: 30px 20px;
          }

          .imageWrapper {
            max-width: 400px;
          }

          .imageContainer {
            margin-bottom: 20px;
          }

          .image {
            max-width: 300px;
          }

          .imageFallback {
            width: 200px;
            height: 200px;
          }

          .fallbackIcon {
            font-size: 80px;
          }

          .welcomeText {
            margin-bottom: 20px;
          }

          .welcomeTitle {
            font-size: 24px;
          }

          .platformName {
            font-size: 32px;
          }

          .welcomeMessage {
            font-size: 16px;
          }

          .formCard {
            padding: 30px;
            border-radius: 30px;
          }

          .formTitle {
            font-size: 28px;
          }
        }

        @media (max-width: 768px) {
          .quickLinks {
            flex-wrap: wrap;
          }

          .quickLink {
            width: calc(50% - 8px);
            padding: 10px 16px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .rightPanel {
            padding: 20px;
          }

          .leftPanel {
            padding: 20px;
          }

          .image {
            max-width: 200px;
          }

          .imageFallback {
            width: 150px;
            height: 150px;
          }

          .fallbackIcon {
            font-size: 60px;
          }

          .welcomeTitle {
            font-size: 20px;
          }

          .platformName {
            font-size: 28px;
          }

          .welcomeMessage {
            font-size: 14px;
          }

          .quickLinks {
            flex-direction: column;
            gap: 10px;
          }

          .quickLink {
            width: 100%;
            padding: 10px 16px;
            font-size: 14px;
          }

          .quickIcon {
            font-size: 16px;
          }

          .formCard {
            padding: 20px;
            border-radius: 20px;
          }

          .formHeader {
            margin-bottom: 20px;
          }

          .formTitle {
            font-size: 24px;
          }

          .formSubtitle {
            font-size: 14px;
          }

          .form {
            gap: 15px;
          }

          .label {
            font-size: 13px;
            gap: 6px;
          }

          .labelIcon {
            font-size: 14px;
          }

          .input {
            padding: 12px 14px;
            font-size: 14px;
            border-radius: 12px;
          }

          .passwordInput {
            padding: 12px 45px 12px 14px;
            font-size: 14px;
            border-radius: 12px;
          }

          .passwordToggle {
            font-size: 16px;
            left: 10px;
          }

          .hint {
            font-size: 11px;
          }

          .forgotHint {
            font-size: 12px;
            gap: 4px;
          }

          .forgotIcon {
            font-size: 12px;
          }

          .message {
            padding: 12px 16px;
            gap: 10px;
            font-size: 13px;
          }

          .messageIcon {
            font-size: 18px;
          }

          .submitButton {
            padding: 14px;
            font-size: 16px;
          }

          .buttonArrow {
            font-size: 18px;
          }

          .footer {
            margin-top: 20px;
          }

          .loginRow {
            flex-direction: column;
            gap: 5px;
          }

          .loginText {
            font-size: 14px;
          }

          .loginLink {
            font-size: 14px;
          }

          .homeLink {
            font-size: 14px;
          }

          .homeIcon {
            font-size: 14px;
          }
        }

        /* للشاشات الصغيرة جداً */
        @media (max-width: 360px) {
          .formCard {
            padding: 15px;
          }

          .formTitle {
            font-size: 22px;
          }

          .welcomeTitle {
            font-size: 18px;
          }

          .platformName {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}

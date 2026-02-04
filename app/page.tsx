'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div style={styles.container}>
      {/* الهيدر */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🎓</span>
            <h1 style={styles.logoText}>علمني العلوم</h1>
          </div>
          <p style={styles.tagline}>منصة التعلم الذكي - مستر بيشوي</p>
        </div>
      </header>

      {/* القسم الرئيسي */}
      <main style={styles.main}>
        <div style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease'
        }}>
          <h1 style={styles.heroTitle}>
            أهلاً بك في منصة 
            <span style={styles.highlight}> "علمني العلوم"</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            رحلتك التعليمية نحو التميز تبدأ من هنا
          </p>

          <p style={styles.description}>
            أنشئ حسابك أو سجل دخولك للوصول للكورسات التعليمية المتخصصة والمحتوى التفاعلي المعد خصيصاً لك
          </p>

          {/* أزرار التسجيل */}
          <div style={styles.buttonsContainer}>
            <button 
              style={styles.primaryButton} 
              onClick={() => router.push('/login')}
            >
              <span style={styles.buttonIcon}>🔐</span>
              تسجيل الدخول
            </button>

            <button 
              style={styles.secondaryButton} 
              onClick={() => router.push('/register')}
            >
              <span style={styles.buttonIcon}>📝</span>
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* مميزات المنصة */}
        <div style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>ماذا تقدم المنصة؟</h2>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📚</div>
              <h3 style={styles.featureTitle}>كورسات متخصصة</h3>
              <p style={styles.featureText}>شروح مفصلة لكل المراحل الدراسية</p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎬</div>
              <h3 style={styles.featureTitle}>فيديوهات تعليمية</h3>
              <p style={styles.featureText}>شرح مرئي مبسط وسهل الفهم</p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👨‍🏫</div>
              <h3 style={styles.featureTitle}>متابعة مستمرة</h3>
              <p style={styles.featureText}>دعم فني ومتابعة من المدرسين</p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>تقييم وتقارير</h3>
              <p style={styles.featureText}>تقارير أداء ومتابعة التقدم</p>
            </div>
          </div>
        </div>

        {/* صورة توضيحية */}
        <div style={styles.imageSection}>
          <div style={styles.imageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1581090700227-84b5302c8192?fit=crop&w=1000&q=80" 
              alt="تعليم تفاعلي"
              style={styles.mainImage}
            />
            <div style={styles.imageOverlay}>
              <p style={styles.overlayText}>نحو تعليم أفضل لمستقبل مشرق</p>
            </div>
          </div>
        </div>
      </main>

      {/* الفوتير */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.footerLogoIcon}>🎓</span>
            <div>
              <h3 style={styles.footerTitle}>علمني العلوم</h3>
              <p style={styles.footerSubtitle}>منصة التعليم التفاعلي</p>
            </div>
          </div>
          
          <div style={styles.footerInfo}>
            <p style={styles.footerText}>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
            <p style={styles.footerText}>مستر بيشوي للعلوم</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
    color: 'white',
    overflowX: 'hidden'
  },
  
  header: {
    width: '100%',
    padding: '20px 5%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  logoIcon: {
    fontSize: '48px',
    animation: 'float 3s ease-in-out infinite'
  },
  
  logoText: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: 0,
    background: 'linear-gradient(45deg, #ff9800, #ff5722)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  tagline: {
    fontSize: '18px',
    color: '#bbdefb',
    margin: 0,
    textAlign: 'center'
  },
  
  main: {
    flex: 1,
    padding: '40px 5%',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    marginBottom: '60px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: 1.2
  },
  
  highlight: {
    color: '#ff9800',
    fontWeight: 'bold'
  },
  
  heroSubtitle: {
    fontSize: '24px',
    color: '#bbdefb',
    marginBottom: '30px'
  },
  
  description: {
    fontSize: '18px',
    lineHeight: 1.6,
    maxWidth: '800px',
    margin: '0 auto 40px',
    color: '#e3f2fd'
  },
  
  buttonsContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  
  primaryButton: {
    padding: '18px 40px',
    fontSize: '18px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #ff9800, #ff5722)',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(255, 152, 0, 0.6)'
    }
  },
  
  secondaryButton: {
    padding: '18px 40px',
    fontSize: '18px',
    borderRadius: '50px',
    border: '2px solid #ff9800',
    cursor: 'pointer',
    background: 'transparent',
    color: '#ff9800',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 152, 0, 0.1)',
      transform: 'translateY(-3px)'
    }
  },
  
  buttonIcon: {
    fontSize: '20px'
  },
  
  featuresSection: {
    marginBottom: '60px'
  },
  
  featuresTitle: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '50px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  
  featureCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-10px)',
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: '#ff9800'
    }
  },
  
  featureIcon: {
    fontSize: '50px',
    marginBottom: '20px',
    display: 'block'
  },
  
  featureTitle: {
    fontSize: '22px',
    marginBottom: '15px',
    color: '#ff9800'
  },
  
  featureText: {
    fontSize: '16px',
    color: '#bbdefb',
    lineHeight: 1.5
  },
  
  imageSection: {
    marginBottom: '60px'
  },
  
  imageContainer: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    maxWidth: '900px',
    margin: '0 auto'
  },
  
  mainImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    display: 'block'
  },
  
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    padding: '30px',
    textAlign: 'center'
  },
  
  overlayText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },
  
  footer: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '40px 5%',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: 'auto'
  },
  
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px'
  },
  
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  footerLogoIcon: {
    fontSize: '40px'
  },
  
  footerTitle: {
    fontSize: '24px',
    margin: 0,
    color: '#ff9800'
  },
  
  footerSubtitle: {
    fontSize: '16px',
    color: '#bbdefb',
    margin: 0
  },
  
  footerInfo: {
    textAlign: 'center'
  },
  
  footerText: {
    fontSize: '16px',
    color: '#90caf9',
    margin: '5px 0'
  }
}
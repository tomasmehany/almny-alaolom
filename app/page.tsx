'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={styles.container}>
      {/* خلفية متحركة */}
      <div style={styles.background}></div>
      <div style={styles.backgroundOverlay}></div>
      
      {/* الهيدر */}
      <header style={{
        ...styles.header,
        background: scrolled ? 'rgba(10, 25, 47, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.2)' : 'none'
      }}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIconWrapper}>
              <span style={styles.logoIcon}>🎓</span>
            </div>
            <div style={styles.logoText}>
              <h1 style={styles.logoMain}>علمني العلوم</h1>
              <p style={styles.logoSub}>منصة مستر بيشوي مالك التعليمية</p>
            </div>
          </div>
          
          <nav style={styles.nav}>
            <button 
              style={styles.navButton}
              onClick={() => router.push('/login')}
            >
              تسجيل الدخول
            </button>
            <button 
              style={styles.navButtonPrimary}
              onClick={() => router.push('/register')}
            >
              إنشاء حساب
            </button>
          </nav>
        </div>
      </header>

      {/* القسم الرئيسي */}
      <main style={styles.main}>
        {/* Hero Section */}
        <div style={{
          ...styles.hero,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={styles.heroContent}>
            <span style={styles.heroBadge}>منصة تعليمية متكاملة</span>
            
            <h1 style={styles.heroTitle}>
              أهلاً بك في  
              <span style={styles.heroHighlight}> "علمني العلوم"</span>
            </h1>
            
            <p style={styles.heroSubtitle}>
              مع مستر بيشوي، رحلتك نحو التفوق تبدأ من هنا
            </p>

            <p style={styles.heroDescription}>
              أنشئ حسابك أو سجل دخولك للوصول إلى الكورسات التعليمية المتخصصة 
              والمحتوى التفاعلي المعد خصيصاً لطلاب المراحل الإعدادية والثانوية
            </p>

            <div style={styles.heroButtons}>
              <button 
                style={styles.primaryButton}
                onClick={() => router.push('/register')}
              >
                <span style={styles.buttonIcon}>✨</span>
                ابدأ رحلتك الآن
              </button>

              <button 
                style={styles.secondaryButton}
                onClick={() => router.push('/login')}
              >
                <span style={styles.buttonIcon}>🔐</span>
                تسجيل الدخول
              </button>
            </div>
          </div>

          <div style={styles.heroImage}>
  <div style={styles.imageWrapper}>
    <video 
      autoPlay 
      loop 
      muted 
      playsInline
      style={{
        width: '100%',
        height: '500px',
        objectFit: 'cover',
        display: 'block'
      }}
    >
      <source src="/videos/my-video.mp4" type="video/mp4" />
    </video>
    <div style={styles.imageOverlay}></div>
    <div style={styles.imageBadge}>
      <span>🎬 التعلم التفاعلي</span>
    </div>
  </div>
</div>
        </div>

        {/* مميزات المنصة */}
        <div style={styles.featuresSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>لماذا تختارنا؟</span>
            <h2 style={styles.sectionTitle}>مميزات المنصة</h2>
            <p style={styles.sectionSubtitle}>
              نقدم لك تجربة تعليمية متكاملة تجمع بين الشرح المبسط والتقييم المستمر
            </p>
          </div>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>📚</span>
              </div>
              <h3 style={styles.featureTitle}>كورسات متخصصة</h3>
              <p style={styles.featureText}>
                شروح مفصلة للعلوم والكيمياء والفيزياء لكل المراحل الإعدادية والثانوية
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>🎬</span>
              </div>
              <h3 style={styles.featureTitle}>فيديوهات تعليمية</h3>
              <p style={styles.featureText}>
                محتوى مرئي مع شرح مبسط وسهل الفهم لكل درس
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>👨‍🏫</span>
              </div>
              <h3 style={styles.featureTitle}>متابعة شخصية</h3>
              <p style={styles.featureText}>
               إجابات على أسئلتك من المدرس والمساعد الذكي الخاص بك 
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>📊</span>
              </div>
              <h3 style={styles.featureTitle}>تقييم وتقارير</h3>
              <p style={styles.featureText}>
                متابعة تقدمك الدراسي وتقارير أداء مفصلة عن مستوى فهمك
              </p>
            </div>
          </div>
        </div>

        {/* قسم الكورسات */}
        <div style={styles.coursesSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>كورساتنا</span>
            <h2 style={styles.sectionTitle}>الكورسات المتاحة</h2>
            <p style={styles.sectionSubtitle}>
              اختر المرحلة الدراسية وابدأ رحلة التعلم معنا
            </p>
          </div>

          <div style={styles.coursesGrid}>
            <div style={styles.courseCard}>
              <div style={styles.courseIcon}>📘</div>
              <h3 style={styles.courseTitle}>المرحلة الإعدادية</h3>
              <div style={styles.courseDetails}>
                <span>الصف الأول الإعدادي</span>
                <span>الصف الثاني الإعدادي</span>
                <span>الصف الثالث الإعدادي</span>
              </div>
              <button 
                style={styles.courseButton}
                onClick={() => router.push('/register')}
              >
                ابدأ التعلم
              </button>
            </div>

            <div style={styles.courseCard}>
              <div style={styles.courseIcon}>📙</div>
              <h3 style={styles.courseTitle}>المرحلة الثانوية</h3>
              <div style={styles.courseDetails}>
                <span>الصف الأول الثانوي</span>
                <span>الصف الثاني الثانوي - كيمياء</span>
                <span>الصف الثاني الثانوي - فيزياء</span>
              </div>
              <button 
                style={styles.courseButton}
                onClick={() => router.push('/register')}
              >
                ابدأ التعلم
              </button>
            </div>
          </div>
        </div>

        {/* قسم الدعم */}
        <div style={styles.supportSection}>
          <div style={styles.supportCard}>
            <div style={styles.supportIcon}>💬</div>
            <div style={styles.supportTextContent}>
              <h3 style={styles.supportTitle}> للمساعدة تواصل مع الادمن </h3>
              <p style={styles.supportText}>
                لديك استفسار؟ تواصل معنا 
              </p>
            </div>
            <button 
              style={styles.supportButton}
              onClick={() => window.open('https://wa.me/message/UKASWZCU5BNLN1?src=qr', '_blank')}
            >
              تواصل عبر واتساب
            </button>
          </div>
        </div>
      </main>

      {/* الفوتر */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerTop}>
            <div style={styles.footerInfo}>
              <div style={styles.footerLogo}>
                <span style={styles.footerLogoIcon}>🎓</span>
                <div>
                  <h3 style={styles.footerTitle}>علمني العلوم</h3>
                  <p style={styles.footerSubtitle}>منصة مستر بيشوي التعليمية</p>
                </div>
              </div>
              <p style={styles.footerDescription}>
                منصة تعليمية متخصصة في تدريس العلوم والكيمياء والفيزياء للمراحل الإعدادية والثانوية
              </p>
            </div>

            <div style={styles.footerLinks}>
              <h4 style={styles.footerLinksTitle}>روابط سريعة</h4>
              <button 
                style={styles.footerLink}
                onClick={() => router.push('/login')}
              >
                تسجيل الدخول
              </button>
              <button 
                style={styles.footerLink}
                onClick={() => router.push('/register')}
              >
                إنشاء حساب
              </button>
              <button 
                style={styles.footerLink}
                onClick={() => window.open('https://wa.me/message/UKASWZCU5BNLN1?src=qr', '_blank')}
              >
                الدعم الفني
              </button>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <p style={styles.copyright}>
              جميع الحقوق محفوظة © {new Date().getFullYear()} علمني العلوم
            </p>
            <p style={styles.developer}>
              تطوير: <a href="mailto:tomasmehany@gmail.com" style={styles.developerLink}>tomasmehany@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @media (max-width: 768px) {
          * {
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  )
}

const styles: any = {
  container: {
    minHeight: '100vh',
    fontFamily: '"Cairo", "Segoe UI", Tahoma, sans-serif',
    position: 'relative',
    overflowX: 'hidden',
    background: '#0a192f',
    direction: 'rtl',
    width: '100%'
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(-45deg, #0a192f, #112240, #1a2f4f, #0a192f)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 15s ease infinite',
    zIndex: 0
  },

  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 50%, rgba(37,99,235,0.1) 0%, transparent 60%)',
    zIndex: 1
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '15px',
    transition: 'all 0.3s ease'
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    flexWrap: 'wrap',
    gap: '15px'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  logoIconWrapper: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite'
  },

  logoIcon: {
    fontSize: '24px'
  },

  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },

  logoMain: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'white',
    margin: 0,
    lineHeight: 1.2
  },

  logoSub: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0
  },

  nav: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },

  navButton: {
    padding: '8px 16px',
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  navButtonPrimary: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 10px 20px rgba(37,99,235,0.3)'
  },

  main: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    alignItems: 'center',
    marginBottom: '60px'
  },

  heroContent: {
    color: 'white'
  },

  heroBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: 'rgba(37,99,235,0.1)',
    border: '1px solid rgba(37,99,235,0.3)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: '15px'
  },

  heroTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '15px',
    lineHeight: 1.2,
    color: 'white'
  },

  heroHighlight: {
    color: '#2563eb'
  },

  heroSubtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    marginBottom: '15px'
  },

  heroDescription: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#cbd5e1',
    marginBottom: '25px'
  },

  heroButtons: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },

  primaryButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    boxShadow: '0 10px 20px rgba(37,99,235,0.3)'
  },

  secondaryButton: {
    padding: '12px 24px',
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  },

  buttonIcon: {
    fontSize: '16px'
  },

  heroImage: {
    position: 'relative',
    animation: 'float 6s ease-in-out infinite'
  },

  imageWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)'
  },

  mainImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    display: 'block'
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
  },

  imageBadge: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    padding: '6px 12px',
    background: 'rgba(37,99,235,0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
  },

  featuresSection: {
    marginBottom: '60px'
  },

  sectionHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },

  sectionBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: 'rgba(37,99,235,0.1)',
    border: '1px solid rgba(37,99,235,0.3)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: '15px'
  },

  sectionTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '15px'
  },

  sectionSubtitle: {
    fontSize: '16px',
    color: '#94a3b8',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },

  featureCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    transition: 'all 0.3s',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },

  featureIconWrapper: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px',
    animation: 'pulse 2s infinite'
  },

  featureIcon: {
    fontSize: '28px'
  },

  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '10px'
  },

  featureText: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.6
  },

  coursesSection: {
    marginBottom: '60px'
  },

  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },

  courseCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s'
  },

  courseIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },

  courseTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '15px'
  },

  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    color: '#94a3b8',
    fontSize: '14px'
  },

  courseButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    width: '100%'
  },

  supportSection: {
    marginBottom: '40px'
  },

  supportCard: {
    background: 'linear-gradient(135deg, #1e293b, #334155)',
    borderRadius: '20px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },

  supportIcon: {
    fontSize: '36px',
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #25D366, #128C7E)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s infinite'
  },

  supportTextContent: {
    flex: 1
  },

  supportTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '5px'
  },

  supportText: {
    fontSize: '14px',
    color: '#94a3b8'
  },

  supportButton: {
    padding: '10px 20px',
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap'
  },

  footer: {
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '40px 20px 20px',
    position: 'relative',
    zIndex: 2
  },

  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },

  footerTop: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
    marginBottom: '40px'
  },

  footerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  footerLogoIcon: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  footerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    margin: 0
  },

  footerSubtitle: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0
  },

  footerDescription: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.6,
    maxWidth: '350px'
  },

  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  footerLinksTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '5px'
  },

  footerLink: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'right',
    cursor: 'pointer',
    padding: '5px 0',
    transition: 'all 0.3s'
  },

  footerBottom: {
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },

  copyright: {
    color: '#94a3b8',
    fontSize: '12px',
    margin: 0
  },

  developer: {
    color: '#94a3b8',
    fontSize: '12px',
    margin: 0
  },

  developerLink: {
    color: '#2563eb',
    textDecoration: 'none',
    transition: 'all 0.3s'
  }
}

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
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
        <div style={{
          ...styles.headerContent,
          flexDirection: 'row',
          justifyContent: isMobile ? 'space-between' : 'space-between',
          alignItems: 'center'
        }}>
          <div style={styles.logo}>
            <div style={styles.logoIconWrapper}>
              <span style={styles.logoIcon}>🎓</span>
            </div>
            <div style={styles.logoText}>
              <h1 style={{
                ...styles.logoMain,
                fontSize: isMobile ? '16px' : '20px'
              }}>علمني العلوم</h1>
              <p style={{
                ...styles.logoSub,
                fontSize: isMobile ? '9px' : '12px',
                display: isMobile ? 'none' : 'block'
              }}>منصة مستر بيشوي التعليمية</p>
            </div>
          </div>
          
          <nav style={{
            ...styles.nav,
            gap: isMobile ? '8px' : '12px'
          }}>
            <button 
              style={{
                ...styles.navButton,
                padding: isMobile ? '6px 12px' : '10px 20px',
                fontSize: isMobile ? '12px' : '14px'
              }}
              onClick={() => router.push('/login')}
            >
              تسجيل الدخول
            </button>
            <button 
              style={{
                ...styles.navButtonPrimary,
                padding: isMobile ? '6px 12px' : '10px 20px',
                fontSize: isMobile ? '12px' : '14px'
              }}
              onClick={() => router.push('/register')}
            >
              إنشاء حساب
            </button>
          </nav>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{
        ...styles.main,
        padding: isMobile ? '20px 15px' : '40px 20px'
      }}>
        {/* Hero Section */}
        <div style={{
          ...styles.hero,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '40px' : '50px',
          marginBottom: isMobile ? '40px' : '60px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease'
        }}>
          <div style={styles.heroContent}>
            <span style={{
              ...styles.heroBadge,
              fontSize: isMobile ? '11px' : '12px'
            }}>منصة تعليمية متكاملة</span>
            
            <h1 style={{
              ...styles.heroTitle,
              fontSize: isMobile ? '28px' : '48px'
            }}>
              أهلاً بك في  
              <span style={styles.heroHighlight}> "علمني العلوم"</span>
            </h1>
            
            <p style={{
              ...styles.heroSubtitle,
              fontSize: isMobile ? '16px' : '18px'
            }}>
              مع مستر بيشوي، رحلتك نحو التفوق تبدأ من هنا
            </p>

            <p style={{
              ...styles.heroDescription,
              fontSize: isMobile ? '13px' : '15px'
            }}>
              أنشئ حسابك أو سجل دخولك للوصول إلى الكورسات التعليمية المتخصصة 
              والمحتوى التفاعلي المعد خصيصاً لطلاب المراحل الإعدادية والثانوية
            </p>

            <div style={{
              ...styles.heroButtons,
              justifyContent: 'flex-start'
            }}>
              <button 
                style={{
                  ...styles.primaryButton,
                  padding: isMobile ? '10px 20px' : '12px 28px',
                  fontSize: isMobile ? '14px' : '16px'
                }}
                onClick={() => router.push('/register')}
              >
                <span style={styles.buttonIcon}>✨</span>
                ابدأ رحلتك الآن
              </button>

              <button 
                style={{
                  ...styles.secondaryButton,
                  padding: isMobile ? '10px 20px' : '12px 28px',
                  fontSize: isMobile ? '14px' : '16px'
                }}
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
                  height: isMobile ? '280px' : '380px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              >
                <source src="/videos/my-video.mp4" type="video/mp4" />
              </video>
              <div style={styles.imageOverlay}></div>
              <div style={{
                ...styles.imageBadge,
                fontSize: isMobile ? '10px' : '12px',
                padding: isMobile ? '4px 10px' : '6px 14px'
              }}>
                <span>🎬 التعلم التفاعلي</span>
              </div>
            </div>
          </div>
        </div>

        {/* مميزات المنصة */}
        <div style={styles.featuresSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>لماذا تختارنا؟</span>
            <h2 style={{
              ...styles.sectionTitle,
              fontSize: isMobile ? '24px' : '36px'
            }}>مميزات المنصة</h2>
            <p style={{
              ...styles.sectionSubtitle,
              fontSize: isMobile ? '14px' : '16px',
              padding: isMobile ? '0 15px' : '0'
            }}>
              نقدم لك تجربة تعليمية متكاملة تجمع بين الشرح المبسط والتقييم المستمر
            </p>
          </div>
          
          <div style={{
            ...styles.featuresGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '15px' : '25px'
          }}>
            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>📚</span>
              </div>
              <h3 style={{
                ...styles.featureTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}>كورسات متخصصة</h3>
              <p style={{
                ...styles.featureText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                شروح مفصلة للعلوم والكيمياء والفيزياء لكل المراحل الدراسية
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>🎬</span>
              </div>
              <h3 style={{
                ...styles.featureTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}>فيديوهات تعليمية</h3>
              <p style={{
                ...styles.featureText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                محتوى مرئي مع شرح مبسط وسهل الفهم لكل درس
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>👨‍🏫</span>
              </div>
              <h3 style={{
                ...styles.featureTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}>متابعة شخصية</h3>
              <p style={{
                ...styles.featureText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                إجابات على أسئلتك من المدرس والمساعد الذكي الخاص بك
              </p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIconWrapper}>
                <span style={styles.featureIcon}>📊</span>
              </div>
              <h3 style={{
                ...styles.featureTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}>تقييم وتقارير</h3>
              <p style={{
                ...styles.featureText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                متابعة تقدمك الدراسي وتقارير أداء مفصلة عن مستوى فهمك
              </p>
            </div>
          </div>
        </div>

        {/* قسم الكورسات */}
        <div style={styles.coursesSection}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionBadge}>كورساتنا</span>
            <h2 style={{
              ...styles.sectionTitle,
              fontSize: isMobile ? '24px' : '36px'
            }}>الكورسات المتاحة</h2>
            <p style={{
              ...styles.sectionSubtitle,
              fontSize: isMobile ? '14px' : '16px',
              padding: isMobile ? '0 15px' : '0'
            }}>
              اختر المرحلة الدراسية وابدأ رحلة التعلم معنا
            </p>
          </div>

          <div style={{
            ...styles.coursesGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '15px' : '25px',
            maxWidth: isMobile ? '100%' : '800px'
          }}>
            <div style={styles.courseCard}>
              <div style={styles.courseIcon}>📘</div>
              <h3 style={{
                ...styles.courseTitle,
                fontSize: isMobile ? '18px' : '22px'
              }}>المرحلة الإعدادية</h3>
              <div style={styles.courseDetails}>
                <span>📗 الصف الأول الإعدادي</span>
                <span>📘 الصف الثاني الإعدادي</span>
                <span>📙 الصف الثالث الإعدادي</span>
              </div>
              <button 
                style={styles.courseButton}
                onClick={() => router.push('/register')}
              >
                ابدأ التعلم ←
              </button>
            </div>

            <div style={styles.courseCard}>
              <div style={styles.courseIcon}>📙</div>
              <h3 style={{
                ...styles.courseTitle,
                fontSize: isMobile ? '18px' : '22px'
              }}>المرحلة الثانوية</h3>
              <div style={styles.courseDetails}>
                <span>📕 الصف الأول الثانوي</span>
                <span>⚗️ الصف الثاني الثانوي - كيمياء</span>
                <span>⚛️ الصف الثاني الثانوي - فيزياء</span>
              </div>
              <button 
                style={styles.courseButton}
                onClick={() => router.push('/register')}
              >
                ابدأ التعلم ←
              </button>
            </div>
          </div>
        </div>

        {/* قسم الدعم */}
        <div style={styles.supportSection}>
          <div style={{
            ...styles.supportCard,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'right',
            gap: isMobile ? '15px' : '20px'
          }}>
            <div style={{
              ...styles.supportIcon,
              width: isMobile ? '50px' : '60px',
              height: isMobile ? '50px' : '60px',
              fontSize: isMobile ? '24px' : '30px'
            }}>💬</div>
            <div style={styles.supportTextContent}>
              <h3 style={{
                ...styles.supportTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}>للمساعدة تواصل مع الأدمن</h3>
              <p style={{
                ...styles.supportText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                لديك استفسار؟ تواصل معنا عبر واتساب
              </p>
            </div>
            <button 
              style={{
                ...styles.supportButton,
                padding: isMobile ? '8px 20px' : '10px 25px',
                fontSize: isMobile ? '13px' : '14px',
                width: isMobile ? '100%' : 'auto'
              }}
              onClick={() => window.open('https://wa.me/message/UKASWZCU5BNLN1?src=qr', '_blank')}
            >
              📱 تواصل عبر واتساب
            </button>
          </div>
        </div>
      </main>

      {/* الفوتر */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={{
            ...styles.footerTop,
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: isMobile ? '30px' : '40px',
            textAlign: isMobile ? 'center' : 'right'
          }}>
            <div style={{
              ...styles.footerInfo,
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
              <div style={styles.footerLogo}>
                <div style={styles.footerLogoIcon}>🎓</div>
                <div>
                  <h3 style={styles.footerTitle}>علمني العلوم</h3>
                  <p style={styles.footerSubtitle}>منصة مستر بيشوي التعليمية</p>
                </div>
              </div>
              <p style={{
                ...styles.footerDescription,
                textAlign: isMobile ? 'center' : 'right',
                maxWidth: isMobile ? '100%' : '350px'
              }}>
                منصة تعليمية متخصصة في تدريس العلوم والكيمياء والفيزياء للمراحل الإعدادية والثانوية
              </p>
            </div>

            <div style={{
              ...styles.footerLinks,
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
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

          <div style={{
            ...styles.footerBottom,
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: 'center'
          }}>
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
    position: 'fixed',
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
    position: 'fixed',
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
    padding: '15px 20px',
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
    flexWrap: 'wrap'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  logoIconWrapper: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'float 3s ease-in-out infinite'
  },

  logoIcon: {
    fontSize: '20px'
  },

  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },

  logoMain: {
    fontWeight: '800',
    color: 'white',
    margin: 0,
    lineHeight: 1.2
  },

  logoSub: {
    color: '#94a3b8',
    margin: 0
  },

  nav: {
    display: 'flex',
    alignItems: 'center'
  },

  navButton: {
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  navButtonPrimary: {
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
  },

  main: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto'
  },

  hero: {
    display: 'flex',
    alignItems: 'center'
  },

  heroContent: {
    flex: 1,
    color: 'white'
  },

  heroBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    background: 'rgba(37,99,235,0.15)',
    border: '1px solid rgba(37,99,235,0.3)',
    borderRadius: '50px',
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: '20px'
  },

  heroTitle: {
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: 1.2,
    color: 'white'
  },

  heroHighlight: {
    color: '#3b82f6'
  },

  heroSubtitle: {
    color: '#cbd5e1',
    marginBottom: '20px',
    fontWeight: '500'
  },

  heroDescription: {
    lineHeight: 1.6,
    color: '#94a3b8',
    marginBottom: '30px'
  },

  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
  },

  secondaryButton: {
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '50px',
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
    flex: 1,
    animation: 'float 6s ease-in-out infinite'
  },

  imageWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)'
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))'
  },

  imageBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(37,99,235,0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },

  featuresSection: {
    marginBottom: '70px'
  },

  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },

  sectionBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    background: 'rgba(37,99,235,0.15)',
    border: '1px solid rgba(37,99,235,0.3)',
    borderRadius: '50px',
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: '15px'
  },

  sectionTitle: {
    fontWeight: '800',
    color: 'white',
    marginBottom: '15px'
  },

  sectionSubtitle: {
    color: '#94a3b8',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6
  },

  featuresGrid: {
    display: 'grid'
  },

  featureCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '25px',
    textAlign: 'center',
    transition: 'all 0.3s',
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)'
  },

  featureIconWrapper: {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px'
  },

  featureIcon: {
    fontSize: '32px'
  },

  featureTitle: {
    fontWeight: '700',
    color: 'white',
    marginBottom: '12px'
  },

  featureText: {
    color: '#94a3b8',
    lineHeight: 1.6
  },

  coursesSection: {
    marginBottom: '70px'
  },

  coursesGrid: {
    display: 'grid',
    margin: '0 auto'
  },

  courseCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '24px',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s'
  },

  courseIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },

  courseTitle: {
    fontWeight: '700',
    color: 'white',
    marginBottom: '15px'
  },

  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '25px',
    color: '#94a3b8',
    fontSize: '14px'
  },

  courseButton: {
    padding: '12px 25px',
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
    marginBottom: '50px'
  },

  supportCard: {
    background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.9))',
    borderRadius: '24px',
    padding: '25px 30px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },

  supportIcon: {
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
    fontWeight: '700',
    color: 'white',
    marginBottom: '5px'
  },

  supportText: {
    color: '#94a3b8'
  },

  supportButton: {
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap'
  },

  footer: {
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
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
    gap: '12px'
  },

  footerLogoIcon: {
    width: '45px',
    height: '45px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px'
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
    lineHeight: 1.6
  },

  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
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
    borderTop: '1px solid rgba(255,255,255,0.05)',
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
    color: '#60a5fa',
    textDecoration: 'none',
    transition: 'all 0.3s'
  }
}

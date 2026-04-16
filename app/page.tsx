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
              fontSize: isMobile ? '28px' : '36px'
            }}>💬</div>
            <div style={styles.supportTextContent}>
              <h3 style={{
                ...styles.supportTitle,
                fontSize: isMobile ? '16px' : '18px'
              }}> للمساعدة تواصل مع الادمن </h3>
              <p style={{
                ...styles.supportText,
                fontSize: isMobile ? '13px' : '14px'
              }}>
                لديك استفسار؟ تواصل معنا 
              </p>
            </div>
            <button 
              style={{
                ...styles.supportButton,
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '13px' : '14px',
                width: isMobile ? '100%' : 'auto'
              }}
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
          <div style={{
            ...styles.footerTop,
            gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
            gap: isMobile ? '30px' : '40px'
          }}>
            <div style={{
              ...styles.footerInfo,
              textAlign: isMobile ? 'center' : 'right',
              alignItems: isMobile ? 'center' : 'flex-start'
            }}>
              <div style={styles.footerLogo}>
                <div style={styles.footerLogoIcon}>
                  <span>🎓</span>
                </div>
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
      `}</style>
    </div>
  )
}

// باقي الـ styles نفس الكود اللي عندك بس محتاج تعديل بسيط
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
    gap: '10px',
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
    boxShadow: '0 10px 20px rgba(37,99,235,0.3)'
  },

  main: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto'
  },

  hero: {
    display: 'grid',
    alignItems: 'center'
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
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: '15px'
  },

  heroTitle: {
    fontWeight: '800',
    marginBottom: '15px',
    lineHeight: 1.2,
    color: 'white'
  },

  heroHighlight: {
    color: '#2563eb'
  },

  heroSubtitle: {
    color: '#94a3b8',
    marginBottom: '15px'
  },

  heroDescription: {
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
    boxShadow: '0 10px 20px rgba(37,99,235,0.3)'
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
    background: 'rgba(37,99,235,0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50px',
    color: 'white',
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
    display: 'grid',
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
    fontWeight: '600',
    color: 'white',
    marginBottom: '10px'
  },

  featureText: {
    color: '#94a3b8',
    lineHeight: 1.6
  },

  coursesSection: {
    marginBottom: '60px'
  },

  coursesGrid: {
    display: 'grid',
    gap: '20px',
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
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
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

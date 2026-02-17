'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function PlatformPage() {
  const [user, setUser] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<any[]>([])
  const [coursesLoading, setCoursesLoading] = useState(false)
  
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const whatsappLink = 'https://wa.me/message/UKASWZCU5BNLN1?src=qr'
  const telegramBotLink = 'https://t.me/AskMrBishoy_bot'

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        
        let userId = ''
        if (parsedUser.id) userId = parsedUser.id
        else if (parsedUser.userId) userId = parsedUser.userId
        else if (parsedUser.uid) userId = parsedUser.uid
        else if (parsedUser._id) userId = parsedUser._id
        else if (parsedUser.phone) userId = parsedUser.phone
        
        if (userId) {
          setUserId(userId)
        }
        
        if (parsedUser.grade && !parsedUser.year) {
          parsedUser.year = parsedUser.grade
        }
        
        if (!parsedUser.year) {
          parsedUser.year = 'غير محدد'
        }
        
        setUser(parsedUser)
        
        if (parsedUser.year && userId) {
          fetchCourses(parsedUser.year, userId)
        }
      } catch (error) {
        console.error('خطأ في تحويل بيانات المستخدم:', error)
      }
    }
    
    setLoading(false)
  }, [])

  const fetchCourses = async (userYear: string, studentId: string) => {
    try {
      setCoursesLoading(true)
      
      const yearCode = convertYearToCode(userYear)
      
      const coursesQuery = query(
        collection(db, "courses"),
        where("grade", "==", yearCode),
        where("isActive", "==", true)
      )
      
      const coursesSnap = await getDocs(coursesQuery)
      const allCourses: any[] = []
      
      coursesSnap.forEach((doc) => {
        allCourses.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      const studentCoursesQuery = query(
        collection(db, "student_courses"),
        where("studentId", "==", studentId),
        where("isActive", "==", true)
      )
      
      const studentCoursesSnap = await getDocs(studentCoursesQuery)
      const openedCourseIds: string[] = []
      
      studentCoursesSnap.forEach((doc) => {
        const data = doc.data()
        openedCourseIds.push(data.courseId)
      })
      
      const coursesWithStatus = allCourses.map(course => ({
        ...course,
        isOpened: openedCourseIds.includes(course.id)
      }))
      
      setCourses(coursesWithStatus)
      
    } catch (error) {
      console.error('خطأ في جلب الكورسات:', error)
      setCourses([])
    } finally {
      setCoursesLoading(false)
    }
  }

  const convertYearToCode = (yearName: string): string => {
    const yearMap: { [key: string]: string } = {
      'أولى إعدادي': '1-prep',
      'اولى اعدادي': '1-prep',
      'أولى اعدادي': '1-prep',
      'الصف الأول الإعدادي': '1-prep',
      '1-prep': '1-prep',
      
      'ثانية إعدادي': '2-prep',
      'ثانيه اعدادي': '2-prep',
      'الصف الثاني الإعدادي': '2-prep',
      '2-prep': '2-prep',
      
      'ثالثة إعدادي': '3-prep',
      'ثالثه اعدادي': '3-prep',
      'الصف الثالث الإعدادي': '3-prep',
      '3-prep': '3-prep',
      
      'أولى ثانوي': '1-secondary',
      'اولى ثانوي': '1-secondary',
      'الصف الأول الثانوي': '1-secondary',
      '1-secondary': '1-secondary',
      
      'ثانية ثانوي': '2-secondary',
      'ثانيه ثانوي': '2-secondary',
      'الصف الثاني الثانوي': '2-secondary',
      '2-secondary': '2-secondary'
    }
    
    return yearMap[yearName] || yearName
  }

  const getYearName = (yearCode: string) => {
    const yearMap: { [key: string]: string } = {
      '1-prep': 'أولى إعدادي',
      '2-prep': 'ثانية إعدادي', 
      '3-prep': 'ثالثة إعدادي',
      '1-secondary': 'أولى ثانوي',
      '2-secondary': 'ثانية ثانوي',
      'first-prep': 'أولى إعدادي',
      'second-prep': 'ثانية إعدادي',
      'third-prep': 'ثالثة إعدادي',
      'أولى إعدادي': 'أولى إعدادي',
      'ثانية إعدادي': 'ثانية إعدادي',
      'ثالثة إعدادي': 'ثالثة إعدادي',
      'أولى ثانوي': 'أولى ثانوي',
      'ثانية ثانوي': 'ثانية ثانوي'
    }
    
    return yearMap[yearCode] || yearCode || 'غير محدد'
  }

  const categorizeCourses = () => {
    if (userYear !== 'ثانية ثانوي') {
      return null
    }
    
    const categories: { [key: string]: any[] } = {
      'all': courses,
      'كيمياء': [],
      'فيزياء': []
    }
    
    courses.forEach(course => {
      if (course.category === 'كيمياء') {
        categories['كيمياء'].push(course)
      } else if (course.category === 'فيزياء') {
        categories['فيزياء'].push(course)
      }
    })
    
    return categories
  }
  
  const getDisplayedCourses = () => {
    if (userYear !== 'ثانية ثانوي' || activeCategory === 'all') {
      return courses
    }
    
    const categories = categorizeCourses()
    return categories ? categories[activeCategory] : courses
  }
  
  const getCategoryStats = () => {
    if (userYear !== 'ثانية ثانوي') return null
    
    const categories = categorizeCourses()
    if (!categories) return null
    
    return {
      chemistry: categories['كيمياء'].length,
      physics: categories['فيزياء'].length,
      total: courses.length
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ fontSize: '3rem' }}>⏳</div>
        <p style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>
          جاري تحميل المنصة...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <p style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>
          يجب تسجيل الدخول أولاً
        </p>
        <Link href="/login" style={styles.loginLink}>
          تسجيل الدخول
        </Link>
      </div>
    )
  }

  const userYear = getYearName(user.year || user.grade || '')
  const categoryStats = getCategoryStats()
  const displayedCourses = getDisplayedCourses()

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.logo}>🎓 علمني العلوم</h1>
            <p style={styles.subLogo}>مستر بيشوي - منصتك التعليمية</p>
          </div>
          
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user.name?.charAt(0) || 'ط'}
            </div>
            <div>
              <div style={styles.userName}>مرحباً، {user.name || 'طالب'}</div>
              <div style={styles.userGrade}>السنة: <strong>{userYear}</strong></div>
            </div>
            <button 
              onClick={() => {
                localStorage.clear()
                window.location.href = '/login'
              }}
              style={styles.logoutButton}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.mobileSidebarContainer}>
          <div style={styles.yearCard}>
            <div style={styles.yearIcon}>📚</div>
            <div>
              <h3 style={styles.yearTitle}>سنتك الدراسية</h3>
              <p style={styles.yearValue}>{userYear}</p>
              <p style={styles.yearNote}>جميع الكورسات المعروضة خاصة بهذه السنة</p>
            </div>
          </div>

          {userYear === 'ثانية ثانوي' && categoryStats && (
            <div style={styles.foldersCard}>
              <h3 style={styles.foldersTitle}>📂 فولدرات المواد</h3>
              <p style={styles.foldersSubtitle}>كيمياء وفيزياء</p>
              
              <div style={styles.folderTabs}>
                <button
                  onClick={() => setActiveCategory('all')}
                  style={{
                    ...styles.folderTab,
                    background: activeCategory === 'all' ? '#3b82f6' : '#f3f4f6',
                    color: activeCategory === 'all' ? 'white' : '#4b5563'
                  }}
                >
                  📚 الكل ({categoryStats.total})
                </button>
                <button
                  onClick={() => setActiveCategory('كيمياء')}
                  style={{
                    ...styles.folderTab,
                    background: activeCategory === 'كيمياء' ? '#8b5cf6' : '#f3f4f6',
                    color: activeCategory === 'كيمياء' ? 'white' : '#4b5563'
                  }}
                >
                  ⚗️ كيمياء ({categoryStats.chemistry})
                </button>
                <button
                  onClick={() => setActiveCategory('فيزياء')}
                  style={{
                    ...styles.folderTab,
                    background: activeCategory === 'فيزياء' ? '#ef4444' : '#f3f4f6',
                    color: activeCategory === 'فيزياء' ? 'white' : '#4b5563'
                  }}
                >
                  ⚛️ فيزياء ({categoryStats.physics})
                </button>
              </div>
              
              <div style={styles.folderStats}>
                <div style={styles.folderStat}>
                  <div style={styles.folderStatNumber}>{categoryStats.chemistry}</div>
                  <div style={styles.folderStatLabel}>كورس كيمياء</div>
                </div>
                <div style={styles.folderStat}>
                  <div style={styles.folderStatNumber}>{categoryStats.physics}</div>
                  <div style={styles.folderStatLabel}>كورس فيزياء</div>
                </div>
              </div>
            </div>
          )}

          <div style={styles.statsCard}>
            <h3 style={styles.statsTitle}>📊 إحصائياتي</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{displayedCourses.length}</div>
                <div style={styles.statLabel}>كورسات متاحة</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{displayedCourses.filter(c => c.isOpened).length}</div>
                <div style={styles.statLabel}>كورسات مفتوحة</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>0</div>
                <div style={styles.statLabel}>دروس مكتملة</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>0%</div>
                <div style={styles.statLabel}>التقدم العام</div>
              </div>
            </div>
          </div>

          <div style={styles.telegramCard}>
            <div style={styles.telegramIcon}>💬</div>
            <div>
              <h4 style={styles.telegramTitle}>للأسئلة والدعم</h4>
              <p style={styles.telegramText}>
                تواصل مع الدعم عبر واتساب أو تليجرام
              </p>
              <div style={styles.contactButtons}>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  style={styles.whatsappButton}
                >
                  📱 واتساب
                </a>
                <a 
                  href={telegramBotLink} 
                  target="_blank" 
                  style={styles.telegramButton}
                >
                  ✈️ تليجرام
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.welcomeCard}>
            <h2 style={styles.welcomeTitle}>🚀 أهلاً بك في منصتك التعليمية</h2>
            <p style={styles.welcomeText}>
              {userYear === 'ثانية ثانوي' ? (
                <>
                  هذه الكورسات الخاصة بثانية ثانوي، مقسمة حسب المادة (كيمياء/فيزياء)<br/>
                  الكورسات المفتوحة ✅ يمكنك الدخول إليها مباشرة.
                  الكورسات المقفولة 🔒 تحتاج للتواصل مع الدعم.
                </>
              ) : (
                <>
                  هذه الكورسات المتاحة لسنتك الدراسية ({userYear})، 
                  الكورسات المفتوحة ✅ يمكنك الدخول إليها مباشرة.<br/>
                  الكورسات المقفولة 🔒 تحتاج للتواصل مع الدعم لتفعيلها.
                </>
              )}
            </p>
          </div>

          {userYear === 'ثانية ثانوي' && activeCategory !== 'all' && (
            <div style={{
              ...styles.activeFolderBar,
              background: activeCategory === 'كيمياء' ? '#8b5cf6' : '#ef4444'
            }}>
              <div style={styles.folderBarContent}>
                <div style={styles.folderBarIcon}>
                  {activeCategory === 'كيمياء' ? '⚗️' : '⚛️'}
                </div>
                <div>
                  <h3 style={styles.folderBarTitle}>
                    {activeCategory === 'كيمياء' ? 'كيمياء' : 'فيزياء'} - ثانية ثانوي
                  </h3>
                  <p style={styles.folderBarText}>
                    {displayedCourses.length} كورس متاح في هذه المادة
                  </p>
                </div>
                <button 
                  onClick={() => setActiveCategory('all')}
                  style={styles.showAllButton}
                >
                  عرض كل الكورسات
                </button>
              </div>
            </div>
          )}

          <div style={styles.coursesCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                {userYear === 'ثانية ثانوي' && activeCategory !== 'all' ? (
                  <>📚 {activeCategory} - ثانية ثانوي</>
                ) : (
                  <>📚 الكورسات المتاحة لـ {userYear}</>
                )}
              </h2>
              <div style={styles.yearBadge}>{userYear}</div>
            </div>

            {coursesLoading ? (
              <div style={styles.loadingCourses}>
                <div style={styles.loadingIcon}>🔄</div>
                <p>جاري تحميل الكورسات...</p>
              </div>
            ) : displayedCourses.length === 0 ? (
              <div style={styles.noCourses}>
                <div style={styles.noCoursesIcon}>
                  {userYear === 'ثانية ثانوي' && activeCategory !== 'all' ? '🧪' : '📭'}
                </div>
                <h3 style={styles.noCoursesTitle}>
                  {userYear === 'ثانية ثانوي' && activeCategory !== 'all' 
                    ? `لا توجد كورسات في ${activeCategory} بعد` 
                    : 'لا توجد كورسات متاحة'}
                </h3>
                <p style={styles.noCoursesText}>
                  {userYear === 'ثانية ثانوي' && activeCategory !== 'all'
                    ? `لم يتم إضافة كورسات في مادة ${activeCategory} لثانية ثانوي بعد.`
                    : `لا توجد كورسات مسجلة لسنتك الدراسية (${userYear}) بعد.`}
                </p>
                <p style={styles.noCoursesSubtext}>
                  يمكن للإدارة إضافة كورسات جديدة من لوحة التحكم.
                </p>
                {userYear === 'ثانية ثانوي' && activeCategory !== 'all' && (
                  <button 
                    onClick={() => setActiveCategory('all')}
                    style={styles.browseAllButton}
                  >
                    استعراض كل الكورسات
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={styles.coursesGrid}>
                  {displayedCourses.map(course => (
                    <div key={course.id} style={{
                      ...styles.courseItem,
                      borderColor: course.isOpened ? '#10b981' : '#e5e7eb'
                    }}>
                      <div style={styles.courseHeader}>
                        <div style={styles.courseIcon}>
                          {course.isOpened ? '📖' : '📚'}
                          {course.category && userYear === 'ثانية ثانوي' && (
                            <span style={{
                              ...styles.categoryBadge,
                              background: course.category === 'كيمياء' ? '#8b5cf6' : '#ef4444'
                            }}>
                              {course.category === 'كيمياء' ? '⚗️' : '⚛️'}
                            </span>
                          )}
                        </div>
                        <h3 style={styles.courseName}>{course.title}</h3>
                      </div>
                      <p style={styles.courseDescription}>
                        {course.description || 'لا يوجد وصف للكورس'}
                      </p>
                      <div style={styles.courseDetails}>
                        <span>📅 تم الإضافة: {new Date(course.createdAt).toLocaleDateString('ar-EG')}</span>
                        {course.price && <span>💰 السعر: {course.price} ج.م</span>}
                        {course.category && userYear === 'ثانية ثانوي' && (
                          <span>📂 {course.category}</span>
                        )}
                      </div>
                      <div style={styles.courseStatus}>
                        {course.isOpened ? (
                          <span style={styles.openedBadge}>✅ مفتوح</span>
                        ) : (
                          <span style={styles.lockedBadge}>🔒 مقفل</span>
                        )}
                        
                        {course.isOpened ? (
                          <Link href={`/course/${course.id}`} style={styles.courseLink}>
                            دخول للكورس
                          </Link>
                        ) : (
                          <div style={styles.requestButtons}>
                            <a 
                              href={whatsappLink}
                              target="_blank"
                              style={styles.whatsappRequestButton}
                            >
                              📱 طلب تفعيل
                            </a>
                            <a 
                              href={telegramBotLink}
                              target="_blank"
                              style={styles.telegramRequestButton}
                            >
                              ✈️ طلب تفعيل
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.coursesInfo}>
                  <p>📌 <strong>عدد الكورسات:</strong> {displayedCourses.length} كورس</p>
                  <p>✅ <strong>الكورسات المفتوحة:</strong> {displayedCourses.filter(c => c.isOpened).length} كورس</p>
                  {userYear === 'ثانية ثانوي' && activeCategory === 'all' && categoryStats && (
                    <p>📂 <strong>التصنيف:</strong> كيمياء: {categoryStats.chemistry} | فيزياء: {categoryStats.physics}</p>
                  )}
                  <p>ℹ️ <strong>ملاحظة:</strong> الكورسات المفتوحة يمكن الدخول إليها مباشرة</p>
                </div>
              </>
            )}

            <div style={styles.paymentNote}>
              <p>📞 <strong>لطلب التفعيل:</strong> تواصل مع الدعم عبر واتساب أو تليجرام</p>
              <p>💳 <strong>طرق الدفع:</strong> اي طريقة دفع الكتروني، أو أي طريقة أخرى</p>
              {userYear === 'ثانية ثانوي' && activeCategory !== 'all' && (
                <button 
                  onClick={() => setActiveCategory('all')}
                  style={styles.backToAllButton}
                >
                  ← العودة لكل الكورسات
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2026 علمني العلوم مستر بيشوي - منصة التعليم الإلكتروني
          </p>
          <div style={styles.footerLinks}>
            <Link href="/privacy" style={styles.footerLink}>سياسة الخصوصية</Link>
            <Link href="/terms" style={styles.footerLink}>الشروط والأحكام</Link>
            <Link href="/contact" style={styles.footerLink}>اتصل بنا</Link>
          </div>
          <div style={styles.footerSupport}>
            <p style={styles.supportInfo}>
              تطوير: <a href="mailto:tomasmehany@gmail.com" style={styles.footerSupportLink}>tomasmehany@gmail.com</a>
            </p>
            <p style={styles.supportInfo}>
              للدعم: 
              <a href={whatsappLink} target="_blank" style={styles.footerSupportLink}>واتساب</a> | 
              <a href={telegramBotLink} target="_blank" style={styles.footerSupportLink}>تليجرام</a>
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ زر الدعم القديم (واتساب/تليجرام) */}
      <a 
        href="/support/chat"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '100px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '50%',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          fontSize: '24px',
          transition: 'all 0.3s'
        }}
        title="الدعم الفني"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        💬
      </a>

      {/* ✅ زر البوت الجديد */}
      <Link href="/bot">
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          cursor: 'pointer',
          background: '#10b981',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
          border: '2px solid white'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#059669';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#10b981';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
        }}
        title="Almny Alolom AI - اسألني"
        >
          🤖
        </div>
      </Link>

      {/* ✅ إضافة animation للزر */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  )
}

const styles: any = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    direction: 'rtl',
    fontFamily: 'Arial, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loginLink: {
    padding: '12px 24px',
    background: 'white',
    color: '#667eea',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  header: {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '0 15px'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '15px 0',
    gap: '15px'
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  subLogo: {
    color: '#6b7280',
    fontSize: '12px',
    margin: 0
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    width: '100%'
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  userGrade: {
    fontSize: '12px',
    color: '#3b82f6',
    fontWeight: '600'
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px'
  },
  main: {
    maxWidth: '1400px',
    margin: '20px auto',
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  mobileSidebarContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  yearCard: {
    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
    color: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  yearIcon: {
    fontSize: '24px',
    background: 'rgba(255,255,255,0.2)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  yearTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 5px 0',
    opacity: 0.9
  },
  yearValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 5px 0'
  },
  yearNote: {
    fontSize: '12px',
    opacity: 0.8,
    margin: 0
  },
  foldersCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '2px solid #e5e7eb'
  },
  foldersTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 5px 0',
    textAlign: 'center'
  },
  foldersSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '15px'
  },
  folderTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px'
  },
  folderTab: {
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  folderStats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    borderTop: '1px solid #e5e7eb'
  },
  folderStat: {
    textAlign: 'center'
  },
  folderStatNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  folderStatLabel: {
    fontSize: '11px',
    color: '#6b7280'
  },
  statsCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  statsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 15px 0',
    textAlign: 'center'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  },
  statItem: {
    textAlign: 'center',
    padding: '15px',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: '5px'
  },
  statLabel: {
    fontSize: '11px',
    color: '#6b7280'
  },
  telegramCard: {
    background: 'linear-gradient(to right, #dbeafe, #93c5fd)',
    borderRadius: '12px',
    padding: '15px',
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start'
  },
  telegramIcon: {
    fontSize: '20px'
  },
  telegramTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e40af',
    margin: '0 0 5px 0'
  },
  telegramText: {
    fontSize: '13px',
    color: '#1e40af',
    margin: '0 0 10px 0'
  },
  contactButtons: {
    display: 'flex',
    gap: '10px'
  },
  whatsappButton: {
    flex: 1,
    display: 'inline-block',
    background: '#25D366',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center'
  },
  telegramButton: {
    flex: 1,
    display: 'inline-block',
    background: '#0088cc',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  welcomeCard: {
    background: 'linear-gradient(to right, #10b981, #34d399)',
    color: 'white',
    borderRadius: '12px',
    padding: '20px'
  },
  welcomeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  welcomeText: {
    fontSize: '13px',
    opacity: 0.9,
    margin: 0,
    lineHeight: '1.6'
  },
  activeFolderBar: {
    borderRadius: '12px',
    color: 'white',
    padding: '12px 15px',
    marginBottom: '15px'
  },
  folderBarContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px'
  },
  folderBarIcon: {
    fontSize: '28px',
    background: 'rgba(255,255,255,0.2)',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  folderBarTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
    flex: 1
  },
  folderBarText: {
    fontSize: '13px',
    opacity: 0.9,
    margin: 0
  },
  showAllButton: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    width: '100%'
  },
  coursesCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  yearBadge: {
    background: '#3b82f6',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  loadingCourses: {
    padding: '40px',
    textAlign: 'center',
    background: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  loadingIcon: {
    fontSize: '2rem',
    marginBottom: '15px'
  },
  noCourses: {
    padding: '40px',
    textAlign: 'center',
    background: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  noCoursesIcon: {
    fontSize: '2rem',
    color: '#9ca3af',
    marginBottom: '15px'
  },
  noCoursesTitle: {
    fontSize: '18px',
    color: '#1f2937',
    marginBottom: '10px'
  },
  noCoursesText: {
    color: '#6b7280',
    marginBottom: '10px',
    fontSize: '14px'
  },
  noCoursesSubtext: {
    color: '#9ca3af',
    fontSize: '12px',
    fontStyle: 'italic',
    marginBottom: '15px'
  },
  browseAllButton: {
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
    marginBottom: '20px'
  },
  courseItem: {
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    padding: '15px'
  },
  courseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  courseIcon: {
    fontSize: '22px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  categoryBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    fontSize: '10px',
    color: 'white',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  courseName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    flex: 1
  },
  courseDescription: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 12px 0',
    lineHeight: '1.5'
  },
  courseDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '12px'
  },
  courseStatus: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  openedBadge: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  lockedBadge: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center'
  },
  requestButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  whatsappRequestButton: {
    padding: '8px 12px',
    background: '#25D366',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    display: 'inline-block',
    textAlign: 'center'
  },
  telegramRequestButton: {
    padding: '8px 12px',
    background: '#0088cc',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    display: 'inline-block',
    textAlign: 'center'
  },
  courseLink: {
    padding: '8px 12px',
    background: '#10b981',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    display: 'block',
    textAlign: 'center'
  },
  coursesInfo: {
    background: '#f0f9ff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '13px',
    color: '#0369a1'
  },
  paymentNote: {
    background: '#f0f9ff',
    borderRadius: '8px',
    padding: '15px',
    marginTop: '15px',
    position: 'relative'
  },
  backToAllButton: {
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    marginTop: '10px',
    width: '100%'
  },
  footer: {
    background: '#1f2937',
    marginTop: '30px',
    padding: '30px 15px'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center'
  },
  footerText: {
    color: '#d1d5db',
    marginBottom: '15px',
    fontSize: '14px'
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '13px'
  },
  footerSupport: {
    marginTop: '20px'
  },
  supportInfo: {
    color: '#9ca3af',
    fontSize: '12px',
    marginTop: '8px'
  },
  footerSupportLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    margin: '0 5px'
  }
}

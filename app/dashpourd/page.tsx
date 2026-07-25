'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // محاكاة بيانات الطالب (مؤقتاً)
    const studentData = {
      id: 1,
      name: 'مثال',
      phone: '0123456789',
      grade: 'أولى إعدادي',
      status: 'مفعل',
      joinDate: '15 يناير 2024'
    }
    
    // في المستقبل: نجيب البيانات من localStorage أو Firebase
    setStudent(studentData)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    // مسح بيانات الجلسة
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const [courses] = useState([
    { id: 1, title: 'علوم', status: 'مفتوح', color: 'green' },
    { id: 2, title: 'علوم', status: 'مقفل', color: 'red' },
    { id: 3, title: 'علوم', status: 'مقفل', color: 'red' },
    { id: 4, title: 'العلوم', status: 'مقفل', color: 'red' }
  ])

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}>⏳</div>
        <p style={styles.loadingText}>جاري تحميل البيانات...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* الهيدر */}
      <header style={styles.header}>
        <h1 style={styles.title}>🎓 علمني العلوم مستر بيشوي</h1>
        <div style={styles.userInfo}>
          <span>مرحباً <strong>توماس مهني</strong>، الطالب: <strong>{student?.name}</strong></span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div style={styles.main}>
        {/* معلومات الطالب */}
        <div style={styles.infoCard}>
          <h2 style={styles.cardTitle}>معلومات الحساب</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.label}>اسم الطالب:</span>
              <span style={styles.value}>{student?.name}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>رقم الهاتف:</span>
              <span style={styles.value}>{student?.phone}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>الصف الدراسي:</span>
              <span style={styles.value}>{student?.grade}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.label}>حالة الحساب:</span>
              <span style={{...styles.value, color: 'green'}}>{student?.status}</span>
            </div>
          </div>
        </div>

        {/* الكورسات */}
        <div style={styles.coursesCard}>
          <h2 style={styles.cardTitle}>الكورسات الخاصة بك</h2>
          <p style={styles.subtitle}>الكورسات المتاحة لصفك الدراسي</p>
          
          <div style={styles.coursesGrid}>
            {courses.map(course => (
              <div key={course.id} style={styles.courseItem}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <span style={{
                  ...styles.courseStatus,
                  background: course.status === 'مفتوح' ? '#d4f7d4' : '#ffe0e0',
                  color: course.color
                }}>
                  {course.status}
                </span>
                <button style={{
                  ...styles.courseBtn,
                  background: course.status === 'مفتوح' ? '#4CAF50' : '#ccc',
                  cursor: course.status === 'مفتوح' ? 'pointer' : 'not-allowed'
                }}>
                  {course.status === 'مفتوح' ? 'الدخول →' : 'في انتظار التفعيل'}
                </button>
                {course.status === 'مقفل' && (
                  <p style={styles.note}>اتصل بالإدارة للتفعيل</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* روابط سريعة */}
        <div style={styles.linksCard}>
          <h2 style={styles.cardTitle}>روابط سريعة</h2>
          <div style={styles.linksGrid}>
            <a href="/profile" style={styles.link}>👤 الملف الشخصي</a>
            <a href="/progress" style={styles.link}>📊 متابعة التقدم</a>
            <a href="/support" style={styles.link}>💬 الدعم الفني</a>
            <a href="/settings" style={styles.link}>⚙️ الإعدادات</a>
          </div>
        </div>
      </div>

      {/* الفوتر */}
      <footer style={styles.footer}>
        <p>© 2024 علمني العلوم مستر بيشوي - إدارة: توماس مهني</p>
        <p>للدعم: 0123456789</p>
      </footer>
    </div>
  )
}

// الأنماط
const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  loader: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  loadingText: {
    color: 'white',
    fontSize: '18px'
  },
  header: {
    background: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '24px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '16px'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  main: {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px'
  },
  infoCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  coursesCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  linksCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    marginTop: 0,
    color: '#333',
    borderBottom: '2px solid #4CAF50',
    paddingBottom: '10px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  label: {
    color: '#666',
    fontWeight: 'bold' as const
  },
  value: {
    color: '#333',
    fontWeight: 'bold' as const
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  },
  courseItem: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center' as const
  },
  courseTitle: {
    margin: '0 0 15px 0',
    color: '#333'
  },
  courseStatus: {
    display: 'inline-block',
    padding: '5px 15px',
    borderRadius: '20px',
    marginBottom: '15px',
    fontWeight: 'bold' as const
  },
  courseBtn: {
    width: '100%',
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold' as const
  },
  note: {
    fontSize: '12px',
    color: '#ff4444',
    marginTop: '10px'
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  link: {
    display: 'block',
    padding: '15px',
    background: '#4CAF50',
    color: 'white',
    textAlign: 'center' as const,
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold' as const
  },
  footer: {
    background: '#333',
    color: 'white',
    textAlign: 'center' as const,
    padding: '20px',
    marginTop: '50px'
  }
}
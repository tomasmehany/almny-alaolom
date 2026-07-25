// admin/device-management/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import DeviceManagement from '@/app/admin/components/DeviceManagement'

export default function DeviceManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    // الحصول على معرف المستخدم من الـ URL
    const params = new URLSearchParams(window.location.search)
    const studentId = params.get('studentId')
    
    if (!studentId) {
      router.push('/admin')
      return
    }

    const loadUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', studentId))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserId(studentId)
          setUserName(data.name || 'طالب')
        } else {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📱 إدارة أجهزة الطالب</h1>
        <p style={styles.subtitle}>الطالب: {userName}</p>
        <button 
          onClick={() => router.push('/admin')}
          style={styles.backButton}
        >
          ← العودة للوحة التحكم
        </button>
      </div>
      
      <div style={styles.content}>
        <DeviceManagement userId={userId} />
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    direction: 'rtl' as const,
    fontFamily: '"Cairo", "Segoe UI", sans-serif',
    padding: '20px'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '5px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '15px'
  },
  backButton: {
    padding: '10px 20px',
    background: '#e5e7eb',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loadingText: {
    textAlign: 'center' as const,
    padding: '50px',
    fontSize: '18px',
    color: '#6b7280'
  }
}
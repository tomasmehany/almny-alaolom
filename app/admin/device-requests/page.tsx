'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPendingDeviceRequests, approveDevice, rejectDevice } from '@/lib/deviceManager'

export default function DeviceRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await getPendingDeviceRequests()
      setRequests(data)
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في جلب الطلبات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleApprove = async (userId: string, deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من الموافقة على هذا الجهاز؟')) return
    
    setProcessing(true)
    setMessage('')
    
    try {
      const result = await approveDevice(userId, deviceId)
      setMessage(result.success ? '✅ ' + result.message : '❌ ' + result.message)
      if (result.success) {
        await loadRequests()
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في الموافقة')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (userId: string, deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من رفض هذا الجهاز؟')) return
    
    setProcessing(true)
    setMessage('')
    
    try {
      const result = await rejectDevice(userId, deviceId)
      setMessage(result.success ? '✅ ' + result.message : '❌ ' + result.message)
      if (result.success) {
        await loadRequests()
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في الرفض')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'غير معروف'
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>جاري تحميل الطلبات...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/admin" style={styles.backButton}>← العودة للوحة التحكم</Link>
          <h1 style={styles.title}>📱 طلبات الأجهزة الجديدة</h1>
          <span style={styles.badge}>{requests.length} طلب</span>
        </div>
      </header>

      <main style={styles.main}>
        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : '#991b1b',
          }}>
            {message}
          </div>
        )}

        {requests.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>✅</span>
            <h3 style={styles.emptyTitle}>لا توجد طلبات</h3>
            <p style={styles.emptyText}>جميع الأجهزة معتمدة أو لا توجد طلبات جديدة</p>
          </div>
        ) : (
          <div style={styles.requestsGrid}>
            {requests.map((request) => (
              <div key={request.deviceId} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <div style={styles.requestInfo}>
                    <span style={styles.requestIcon}>👤</span>
                    <div>
                      <h3 style={styles.requestUserName}>{request.userName}</h3>
                      <span style={styles.requestUserPhone}>📱 {request.userPhone}</span>
                    </div>
                  </div>
                  <span style={styles.requestStatus}>⏳ في الانتظار</span>
                </div>

                <div style={styles.requestDevice}>
                  <div style={styles.requestDeviceInfo}>
                    <span>📱 الجهاز: {request.deviceId?.substring(0, 20)}...</span>
                  </div>
                  <div style={styles.requestDeviceMeta}>
                    <span>🖥️ {request.platform || 'غير معروف'}</span>
                    <span>📅 {formatDate(request.requestedAt)}</span>
                  </div>
                </div>

                <div style={styles.requestActions}>
                  <button
                    onClick={() => handleApprove(request.userId, request.deviceId)}
                    disabled={processing}
                    style={{
                      ...styles.approveBtn,
                      opacity: processing ? 0.5 : 1,
                      cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ✅ موافقة
                  </button>
                  <button
                    onClick={() => handleReject(request.userId, request.deviceId)}
                    disabled={processing}
                    style={{
                      ...styles.rejectBtn,
                      opacity: processing ? 0.5 : 1,
                      cursor: processing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ❌ رفض
                  </button>
                  <Link
                    href={`/admin/device-management?studentId=${request.userId}`}
                    style={styles.detailsBtn}
                  >
                    📋 التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    direction: 'rtl' as const,
    fontFamily: '"Cairo", "Segoe UI", sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '15px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,215,0,0.1)',
    borderTopColor: '#FFD700',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    background: 'white',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  backButton: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  badge: {
    padding: '4px 12px',
    background: '#f59e0b',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: 'white',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '10px',
  },
  emptyText: {
    color: '#6b7280',
  },
  requestsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  requestCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  requestInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  requestIcon: {
    fontSize: '32px',
  },
  requestUserName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  requestUserPhone: {
    fontSize: '14px',
    color: '#6b7280',
  },
  requestStatus: {
    padding: '4px 12px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  requestDevice: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  },
  requestDeviceInfo: {
    fontSize: '14px',
    color: '#4b5563',
  },
  requestDeviceMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  approveBtn: {
    padding: '8px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  rejectBtn: {
    padding: '8px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  detailsBtn: {
    padding: '8px 20px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center' as const,
  },
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}
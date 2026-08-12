'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { approveDevice, rejectDevice } from '@/lib/deviceManager'

interface DeviceManagementProps {
  userId: string
}

export default function DeviceManagement({ userId }: DeviceManagementProps) {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    loadUserDevices()
  }, [userId])

  const loadUserDevices = async () => {
    try {
      setLoading(true)
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        setMessage('❌ المستخدم غير موجود')
        setLoading(false)
        return
      }

      const data = userDoc.data()
      setUserData(data)
      setDevices(data.devices || [])
      
    } catch (error) {
      console.error('❌ خطأ في جلب الأجهزة:', error)
      setMessage('❌ حدث خطأ في جلب الأجهزة')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من الموافقة على هذا الجهاز؟')) return
    
    setProcessing(true)
    setMessage('')
    
    try {
      const result = await approveDevice(userId, deviceId)
      setMessage(result.success ? '✅ ' + result.message : '❌ ' + result.message)
      if (result.success) {
        await loadUserDevices()
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في الموافقة على الجهاز')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من رفض هذا الجهاز؟')) return
    
    setProcessing(true)
    setMessage('')
    
    try {
      const result = await rejectDevice(userId, deviceId)
      setMessage(result.success ? '✅ ' + result.message : '❌ ' + result.message)
      if (result.success) {
        await loadUserDevices()
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في رفض الجهاز')
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

  const getStatusBadge = (device: any) => {
    if (device.isApproved && device.status === 'approved') {
      return { label: '✅ معتمد', color: '#10b981', bg: '#d1fae5' }
    }
    if (device.status === 'pending') {
      return { label: '⏳ في الانتظار', color: '#f59e0b', bg: '#fef3c7' }
    }
    if (device.status === 'rejected') {
      return { label: '❌ مرفوض', color: '#ef4444', bg: '#fee2e2' }
    }
    return { label: '📱 جهاز', color: '#6b7280', bg: '#f3f4f6' }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>جاري تحميل الأجهزة...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {message && (
        <div style={{
          ...styles.message,
          background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
          color: message.includes('✅') ? '#065f46' : '#991b1b',
        }}>
          {message}
        </div>
      )}

      <div style={styles.userInfo}>
        <h3 style={styles.userInfoTitle}>👤 معلومات الطالب</h3>
        <div style={styles.userInfoGrid}>
          <div><strong>الاسم:</strong> {userData?.name || 'غير معروف'}</div>
          <div><strong>رقم الهاتف:</strong> {userData?.phone || 'غير معروف'}</div>
          <div><strong>المرحلة:</strong> {userData?.grade || 'غير معروف'}</div>
          <div><strong>حالة الأجهزة:</strong> {userData?.deviceApproved ? '✅ مفعل' : '⏳ غير مفعل'}</div>
        </div>
      </div>

      <h3 style={styles.devicesTitle}>📱 الأجهزة المسجلة</h3>

      {devices.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📭</span>
          <p>لا توجد أجهزة مسجلة لهذا الطالب</p>
        </div>
      ) : (
        <div style={styles.devicesList}>
          {devices.map((device, index) => {
            const status = getStatusBadge(device)
            const isPrimary = device.isPrimary
            const isPending = device.status === 'pending'
            const isApproved = device.isApproved && device.status === 'approved'
            
            return (
              <div key={device.deviceId || index} style={{
                ...styles.deviceCard,
                borderColor: isApproved ? '#10b981' : isPending ? '#f59e0b' : '#e5e7eb',
                background: isPrimary ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.02)',
              }}>
                <div style={styles.deviceHeader}>
                  <div style={styles.deviceInfo}>
                    <span style={styles.deviceIcon}>📱</span>
                    <div>
                      <div style={styles.deviceId}>المعرف: {device.deviceId || 'غير معروف'}</div>
                      <div style={styles.devicePlatform}>
                        {device.platform || 'غير معروف'} • {device.userAgent?.substring(0, 50) || 'غير معروف'}
                      </div>
                    </div>
                  </div>
                  <div style={styles.deviceStatus}>
                    {isPrimary && (
                      <span style={{
                        ...styles.primaryBadge,
                        background: '#10b981',
                        color: 'white',
                      }}>
                        ⭐ أساسي
                      </span>
                    )}
                    <span style={{
                      ...styles.statusBadge,
                      background: status.bg,
                      color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <div style={styles.deviceMeta}>
                  <span>📅 {formatDate(device.registeredAt || device.requestedAt)}</span>
                  {device.approvedAt && (
                    <span>✅ {formatDate(device.approvedAt)}</span>
                  )}
                </div>

                {isPending && (
                  <div style={styles.deviceActions}>
                    <button
                      onClick={() => handleApprove(device.deviceId)}
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
                      onClick={() => handleReject(device.deviceId)}
                      disabled={processing}
                      style={{
                        ...styles.rejectBtn,
                        opacity: processing ? 0.5 : 1,
                        cursor: processing ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ❌ رفض
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={styles.infoBox}>
        <p>📌 ملاحظات:</p>
        <ul style={styles.infoList}>
          <li>✅ <strong>الجهاز الأساسي</strong> يتم الموافقة عليه تلقائياً عند أول تسجيل دخول</li>
          <li>⏳ <strong>الأجهزة الجديدة</strong> تحتاج إلى موافقة من الأدمن</li>
          <li>📱 كل طالب يمكنه استخدام <strong>جهاز واحد فقط</strong> في نفس الوقت</li>
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255,255,255,0.05)',
    direction: 'rtl' as const,
    color: 'white',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
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
  message: {
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '600',
  },
  userInfo: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  userInfoTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: 'rgba(255,255,255,0.8)',
  },
  userInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
  },
  devicesTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'rgba(255,255,255,0.8)',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: 'rgba(255,255,255,0.3)',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '10px',
  },
  devicesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '25px',
  },
  deviceCard: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '16px 20px',
    transition: 'all 0.3s',
  },
  deviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '10px',
    marginBottom: '10px',
  },
  deviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  deviceIcon: {
    fontSize: '24px',
  },
  deviceId: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  devicePlatform: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '2px',
  },
  deviceStatus: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  primaryBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  statusBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  deviceMeta: {
    display: 'flex',
    gap: '15px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    paddingRight: '36px',
  },
  deviceActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
    paddingRight: '36px',
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
  infoBox: {
    background: 'rgba(59,130,246,0.05)',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid rgba(59,130,246,0.1)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
  },
  infoList: {
    margin: '8px 0 0 0',
    paddingRight: '20px',
    lineHeight: 1.8,
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
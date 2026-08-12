// app/admin/device-management/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import Link from 'next/link'

export default function DeviceManagementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'users'))
      const usersData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.role === 'student')
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      
      setUsers(usersData)
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في جلب المستخدمين')
    } finally {
      setLoading(false)
    }
  }

  const loadUserDevices = (user: any) => {
    setSelectedUser(user)
    setDevices(user.devices || [])
  }

  const approveDevice = async (userId: string, deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من الموافقة على هذا الجهاز؟')) return
    
    setProcessing(true)
    try {
      const userRef = doc(db, 'users', userId)
      const user = users.find(u => u.id === userId)
      const updatedDevices = (user?.devices || []).map((d: any) => {
        if (d.deviceId === deviceId) {
          return { ...d, isApproved: true, status: 'approved', approvedAt: new Date().toISOString() }
        }
        return d
      })
      
      await updateDoc(userRef, {
        devices: updatedDevices,
        deviceApproved: true,
        updatedAt: serverTimestamp(),
      })
      
      setMessage('✅ تم الموافقة على الجهاز بنجاح')
      await loadUsers()
      if (selectedUser) loadUserDevices({ ...selectedUser, devices: updatedDevices })
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في الموافقة')
    } finally {
      setProcessing(false)
    }
  }

  const rejectDevice = async (userId: string, deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من رفض هذا الجهاز؟')) return
    
    setProcessing(true)
    try {
      const userRef = doc(db, 'users', userId)
      const user = users.find(u => u.id === userId)
      const updatedDevices = (user?.devices || []).filter((d: any) => d.deviceId !== deviceId)
      
      await updateDoc(userRef, {
        devices: updatedDevices,
        updatedAt: serverTimestamp(),
      })
      
      setMessage('✅ تم رفض الجهاز')
      await loadUsers()
      if (selectedUser) loadUserDevices({ ...selectedUser, devices: updatedDevices })
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في الرفض')
    } finally {
      setProcessing(false)
    }
  }

  const deleteDevice = async (userId: string, deviceId: string) => {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا الجهاز نهائياً؟')) return
    
    setProcessing(true)
    try {
      const userRef = doc(db, 'users', userId)
      const user = users.find(u => u.id === userId)
      const updatedDevices = (user?.devices || []).filter((d: any) => d.deviceId !== deviceId)
      
      await updateDoc(userRef, {
        devices: updatedDevices,
        updatedAt: serverTimestamp(),
      })
      
      setMessage('✅ تم حذف الجهاز بنجاح')
      await loadUsers()
      if (selectedUser) loadUserDevices({ ...selectedUser, devices: updatedDevices })
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في حذف الجهاز')
    } finally {
      setProcessing(false)
    }
  }

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`⚠️ هل أنت متأكد من حذف المستخدم "${userName}" وجميع أجهزته؟`)) return
    
    setProcessing(true)
    try {
      await deleteDoc(doc(db, 'users', userId))
      setMessage(`✅ تم حذف المستخدم ${userName} بنجاح`)
      await loadUsers()
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
        setDevices([])
      }
    } catch (error) {
      console.error('❌ خطأ:', error)
      setMessage('❌ حدث خطأ في حذف المستخدم')
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
        <p>جاري تحميل المستخدمين...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/admin" style={styles.backButton}>← العودة للوحة التحكم</Link>
          <h1 style={styles.title}>📱 إدارة أجهزة الطلاب</h1>
          <span style={styles.badge}>{users.length} طالب</span>
        </div>
      </header>

      <main style={styles.main}>
        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.includes('✅') ? '#34d399' : '#f87171',
          }}>
            {message}
          </div>
        )}

        <div style={styles.grid}>
          <div style={styles.usersList}>
            <h3 style={styles.sectionTitle}>👨‍🎓 الطلاب</h3>
            {users.length === 0 ? (
              <div style={styles.emptyState}>
                <span>📭</span>
                <p>لا يوجد طلاب</p>
              </div>
            ) : (
              users.map((user) => {
                const deviceCount = (user.devices || []).length
                const pendingCount = (user.devices || []).filter((d: any) => d.status === 'pending').length
                
                return (
                  <div
                    key={user.id}
                    style={{
                      ...styles.userItem,
                      background: selectedUser?.id === user.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                      borderColor: selectedUser?.id === user.id ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <div 
                      onClick={() => loadUserDevices(user)}
                      style={styles.userClickArea}
                    >
                      <div style={styles.userAvatar}>
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div style={styles.userInfo}>
                        <span style={styles.userName}>{user.name || 'مستخدم'}</span>
                        <span style={styles.userPhone}>{user.phone || 'لا يوجد'}</span>
                      </div>
                      <div style={styles.userBadges}>
                        {pendingCount > 0 && (
                          <span style={styles.pendingBadge}>{pendingCount} معلق</span>
                        )}
                        <span style={styles.deviceCountBadge}>{deviceCount} جهاز</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteUser(user.id, user.name)}
                      style={styles.deleteUserBtn}
                      title="حذف المستخدم"
                    >
                      🗑️
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div style={styles.devicesList}>
            {selectedUser ? (
              <>
                <div style={styles.selectedUserHeader}>
                  <h3 style={styles.sectionTitle}>📱 أجهزة {selectedUser.name}</h3>
                  <span style={styles.selectedUserPhone}>📱 {selectedUser.phone}</span>
                </div>

                {devices.length === 0 ? (
                  <div style={styles.emptyState}>
                    <span>📭</span>
                    <p>لا توجد أجهزة مسجلة لهذا الطالب</p>
                  </div>
                ) : (
                  devices.map((device: any, index: number) => {
                    const isPending = device.status === 'pending'
                    const isApproved = device.isApproved && device.status === 'approved'
                    
                    return (
                      <div key={device.deviceId || index} style={{
                        ...styles.deviceCard,
                        borderColor: isApproved ? '#10b981' : isPending ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                      }}>
                        <div style={styles.deviceHeader}>
                          <div style={styles.deviceInfo}>
                            <span style={styles.deviceIcon}>📱</span>
                            <div>
                              <div style={styles.deviceId}>المعرف: {device.deviceId?.substring(0, 20) || 'غير معروف'}...</div>
                              <div style={styles.devicePlatform}>
                                {device.platform || 'غير معروف'} • {device.userAgent?.substring(0, 30) || 'غير معروف'}
                              </div>
                            </div>
                          </div>
                          <div style={styles.deviceStatus}>
                            {device.isPrimary && (
                              <span style={{ ...styles.statusBadge, background: '#10b981', color: 'white' }}>⭐ أساسي</span>
                            )}
                            <span style={{
                              ...styles.statusBadge,
                              background: isApproved ? 'rgba(16,185,129,0.15)' : isPending ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                              color: isApproved ? '#34d399' : isPending ? '#f59e0b' : '#f87171',
                            }}>
                              {isApproved ? '✅ معتمد' : isPending ? '⏳ في الانتظار' : '❌ مرفوض'}
                            </span>
                          </div>
                        </div>

                        <div style={styles.deviceMeta}>
                          <span>📅 {formatDate(device.registeredAt || device.requestedAt)}</span>
                          {device.approvedAt && <span>✅ {formatDate(device.approvedAt)}</span>}
                        </div>

                        <div style={styles.deviceActions}>
                          {isPending && (
                            <>
                              <button
                                onClick={() => approveDevice(selectedUser.id, device.deviceId)}
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
                                onClick={() => rejectDevice(selectedUser.id, device.deviceId)}
                                disabled={processing}
                                style={{
                                  ...styles.rejectBtn,
                                  opacity: processing ? 0.5 : 1,
                                  cursor: processing ? 'not-allowed' : 'pointer',
                                }}
                              >
                                ❌ رفض
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteDevice(selectedUser.id, device.deviceId)}
                            disabled={processing}
                            style={{
                              ...styles.deleteDeviceBtn,
                              opacity: processing ? 0.5 : 1,
                              cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                            title="حذف الجهاز نهائياً"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </>
            ) : (
              <div style={styles.selectUserMessage}>
                <span style={styles.selectIcon}>👈</span>
                <p>اختر طالباً لعرض أجهزته</p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.infoBox}>
          <p>📌 ملاحظات:</p>
          <ul style={styles.infoList}>
            <li>✅ <strong>الجهاز الأساسي</strong> يتم الموافقة عليه تلقائياً عند أول تسجيل دخول</li>
            <li>⏳ <strong>الأجهزة الجديدة</strong> تحتاج إلى موافقة من الأدمن</li>
            <li>📱 كل طالب يمكنه استخدام <strong>جهاز واحد فقط</strong> في نفس الوقت</li>
            <li>🗑️ <strong>زر الحذف</strong> يحذف الجهاز نهائياً (حتى لو معتمد)</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a14, #1a1a2e)',
    color: 'white',
    fontFamily: '"Cairo", "Segoe UI", sans-serif',
    direction: 'rtl' as const,
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
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.02)',
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
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '14px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  badge: {
    padding: '4px 12px',
    background: 'rgba(16,185,129,0.1)',
    color: '#34d399',
    borderRadius: '20px',
    fontSize: '12px',
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '20px',
    minHeight: '400px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: 'rgba(255,255,255,0.8)',
  },
  usersList: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    maxHeight: '600px',
    overflowY: 'auto' as const,
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 12px',
    borderRadius: '10px',
    border: '1px solid',
    marginBottom: '8px',
    transition: 'all 0.3s',
  },
  userClickArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    cursor: 'pointer',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    display: 'block',
  },
  userPhone: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  userBadges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  pendingBadge: {
    padding: '2px 8px',
    background: 'rgba(245,158,11,0.2)',
    color: '#f59e0b',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  deviceCountBadge: {
    padding: '2px 8px',
    background: 'rgba(59,130,246,0.1)',
    color: '#60a5fa',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  deleteUserBtn: {
    padding: '4px 10px',
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
    flexShrink: 0,
  },
  devicesList: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    minHeight: '400px',
  },
  selectedUserHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  selectedUserPhone: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.3)',
  },
  selectUserMessage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    color: 'rgba(255,255,255,0.3)',
  },
  selectIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px',
    color: 'rgba(255,255,255,0.3)',
  },
  deviceCard: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '12px',
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
  deleteDeviceBtn: {
    padding: '8px 16px',
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  infoBox: {
    marginTop: '20px',
    padding: '16px 20px',
    background: 'rgba(59,130,246,0.05)',
    borderRadius: '12px',
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
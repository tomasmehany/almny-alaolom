'use client'
import { useState, useEffect } from 'react'
import { 
  getUserDevices, 
  deleteDevice, 
  approveDeviceRequest, 
  getPendingDeviceRequests 
} from '@/utils/deviceManager'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore'

export default function DeviceManagement({ userId, isAdminView = false }: { userId?: string, isAdminView?: boolean }) {
  const [devices, setDevices] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('all')

  const loadDevices = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const result = await getUserDevices(userId)
      if (result.success && result.devices) {
        setDevices(result.devices)
      } else {
        setMessage(result.message || '❌ حدث خطأ')
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في جلب الأجهزة')
    } finally {
      setLoading(false)
    }
  }

  const loadPendingRequests = async () => {
    try {
      console.log('🔄 جاري تحميل الطلبات المعلقة...')
      const result = await getPendingDeviceRequests()
      console.log('📊 نتيجة الطلبات:', result)
      
      if (result.success && result.requests) {
        let filtered = result.requests
        if (selectedGrade !== 'all') {
          filtered = result.requests.filter(r => r.studentGrade === selectedGrade)
        }
        console.log('📊 الطلبات بعد التصفية:', filtered)
        setPendingRequests(filtered)
      } else {
        console.log('❌ خطأ في جلب الطلبات:', result.message)
      }
    } catch (error) {
      console.error('Error loading requests:', error)
    }
  }

  const handleApproveRequest = async (requestId: string, approve: boolean) => {
    try {
      const result = await approveDeviceRequest(requestId, approve)
      setMessage(result.message)
      if (result.success) {
        await loadPendingRequests()
        if (userId) {
          await loadDevices()
        }
      }
    } catch (error) {
      setMessage('❌ حدث خطأ في معالجة الطلب')
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الجهاز؟')) return

    try {
      if (isAdminView) {
        const deviceRef = doc(db, 'user_devices', deviceId)
        await deleteDoc(deviceRef)
        setMessage('✅ تم حذف الجهاز بنجاح')
        await loadPendingRequests()
        return
      }

      if (!userId) {
        setMessage('❌ لم يتم تحديد المستخدم')
        return
      }

      const result = await deleteDevice(deviceId, userId)
      setMessage(result.message)
      if (result.success) {
        await loadDevices()
      }
    } catch (error) {
      console.error('Error deleting device:', error)
      setMessage('❌ حدث خطأ في حذف الجهاز')
    }
  }

  useEffect(() => {
    if (userId) {
      loadDevices()
    }
    if (isAdminView) {
      loadPendingRequests()
    }
  }, [userId, isAdminView, selectedGrade])

  const formatDate = (date: any) => {
    if (!date) return 'غير معروف'
    try {
      return new Date(date).toLocaleString('ar-EG', {
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

  const getGradeName = (gradeCode: string) => {
    const grades: { [key: string]: string } = {
      '1-prep': 'أولى إعدادي',
      '2-prep': 'ثانية إعدادي',
      '3-prep': 'ثالثة إعدادي',
      '1-secondary': 'أولى ثانوي',
      '2-secondary': 'ثانية ثانوي',
      '3-secondary': 'ثالثة ثانوي'
    }
    return grades[gradeCode] || gradeCode
  }

  const getDeviceType = (platform: string) => {
    if (!platform) return '📱 جهاز غير معروف'
    if (platform.includes('iPhone')) return '📱 iPhone'
    if (platform.includes('iPad')) return '📱 iPad'
    if (platform.includes('Mac')) return '💻 Mac'
    if (platform.includes('Windows')) return '💻 Windows'
    if (platform.includes('Android')) return '📱 Android'
    if (platform.includes('Linux')) return '🐧 Linux'
    return '📱 جهاز'
  }

  // ============================================
  // عرض طلبات الأجهزة (للأدمن) - معدل
  // ============================================
  if (isAdminView) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>📩 طلبات إضافة أجهزة جديدة</h3>
        
        {message && (
          <div style={{
            ...styles.message,
            background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : '#991b1b'
          }}>
            {message}
          </div>
        )}

        <div style={styles.filterBar}>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">📚 كل المراحل</option>
            <option value="1-prep">أولى إعدادي</option>
            <option value="2-prep">ثانية إعدادي</option>
            <option value="3-prep">ثالثة إعدادي</option>
            <option value="1-secondary">أولى ثانوي</option>
            <option value="2-secondary">ثانية ثانوي</option>
            <option value="3-secondary">ثالثة ثانوي</option>
          </select>
          <span style={styles.requestCount}>
            📊 {pendingRequests.length} طلب معلق
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <p style={styles.emptyText}>✨ لا توجد طلبات أجهزة معلقة</p>
        ) : (
          <div style={styles.requestsGrid}>
            {pendingRequests.map(request => (
              <div key={request.id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <div style={styles.requestStudent}>
                    <div style={styles.requestAvatar}>
                      {request.studentName?.charAt(0) || 'ط'}
                    </div>
                    <div>
                      <h4 style={styles.requestName}>
                        {request.studentName || 'طالب غير معروف'}
                        {request.studentName === 'غير معروف' && (
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#ef4444', 
                            marginRight: '10px',
                            background: '#fee2e2',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            ⚠️ تأكد من userId
                          </span>
                        )}
                      </h4>
                      <p style={styles.requestDetail}>📱 {request.studentPhone || 'غير معروف'}</p>
                      <p style={styles.requestDetail}>📚 {getGradeName(request.studentGrade || 'غير محدد')}</p>
                      <p style={styles.requestDetail}>🆔 {request.userId}</p>
                    </div>
                  </div>
                  <div style={styles.requestDate}>
                    📅 {formatDate(request.requestDate)}
                  </div>
                </div>
                
                <div style={styles.requestDeviceInfo}>
                  <p>📱 <strong>الجهاز:</strong> {getDeviceType(request.platform)}</p>
                  <p>🌐 <strong>المتصفح:</strong> {request.userAgent?.substring(0, 60)}...</p>
                  <p style={styles.requestDeviceId}>
                    🆔 {request.deviceId}
                  </p>
                </div>

                <div style={styles.requestActions}>
                  <button
                    onClick={() => handleApproveRequest(request.id, true)}
                    style={styles.approveButton}
                  >
                    ✅ موافقة
                  </button>
                  <button
                    onClick={() => handleApproveRequest(request.id, false)}
                    style={styles.rejectButton}
                  >
                    ❌ رفض
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(request.id)}
                    style={styles.deleteButton}
                  >
                    🗑️ حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ============================================
  // عرض أجهزة طالب معين
  // ============================================
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📱 أجهزة الطالب</h3>
      
      {message && (
        <div style={{
          ...styles.message,
          background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
          color: message.includes('✅') ? '#065f46' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      <div style={styles.statsBar}>
        <span style={styles.statsBadge}>
          📊 عدد الأجهزة: {devices.filter(d => d.isActive).length}
        </span>
        <span style={styles.statsBadge}>
          🔑 الحد الأقصى: جهاز واحد (افتراضي)
        </span>
      </div>

      {loading ? (
        <p style={styles.loadingText}>جاري تحميل الأجهزة...</p>
      ) : devices.filter(d => d.isActive).length === 0 ? (
        <p style={styles.emptyText}>لا توجد أجهزة مسجلة</p>
      ) : (
        <div style={styles.devicesGrid}>
          {devices.filter(d => d.isActive).map(device => (
            <div key={device.id} style={{
              ...styles.deviceCard,
              borderColor: device.isPrimary ? '#3b82f6' : '#e5e7eb'
            }}>
              <div style={styles.deviceHeader}>
                <div style={styles.deviceIcon}>
                  {device.isPrimary ? '⭐' : '📱'}
                </div>
                <div style={styles.deviceInfo}>
                  <h4 style={styles.deviceName}>
                    {device.deviceName || 'جهاز غير مسمى'}
                    {device.isPrimary && (
                      <span style={styles.primaryBadge}> (أساسي)</span>
                    )}
                    {device.status === 'pending' && (
                      <span style={styles.pendingBadge}> ⏳ قيد الموافقة</span>
                    )}
                  </h4>
                  <p style={styles.deviceDetail}>
                    📱 {getDeviceType(device.platform)}
                  </p>
                  <p style={styles.deviceDetail}>
                    🌐 {device.userAgent?.substring(0, 40)}...
                  </p>
                  <p style={styles.deviceDetail}>
                    🕐 أضيف: {formatDate(device.addedAt)}
                  </p>
                  <p style={styles.deviceDetail}>
                    🕐 آخر دخول: {formatDate(device.lastLogin)}
                  </p>
                </div>
              </div>
              {device.status !== 'pending' && (
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  style={{
                    ...styles.deleteButton,
                    opacity: (device.isPrimary && devices.filter(d => d.isActive).length === 1) ? 0.5 : 1,
                    cursor: (device.isPrimary && devices.filter(d => d.isActive).length === 1) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={device.isPrimary && devices.filter(d => d.isActive).length === 1}
                >
                  🗑️ حذف الجهاز
                </button>
              )}
              {device.status === 'pending' && (
                <div style={styles.pendingMessage}>
                  ⏳ هذا الجهاز في انتظار الموافقة
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Styles
// ============================================
const styles = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px'
  },
  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  statsBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  statsBadge: {
    background: '#f3f4f6',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#4b5563'
  },
  filterBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  filterSelect: {
    padding: '10px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    background: 'white',
    outline: 'none',
    minWidth: '200px'
  },
  requestCount: {
    background: '#eff6ff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#1e40af',
    fontWeight: '600'
  },
  requestsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
    marginTop: '15px'
  },
  requestCard: {
    border: '2px solid #f59e0b',
    borderRadius: '12px',
    padding: '20px',
    background: '#fffbeb'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  requestStudent: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  requestAvatar: {
    width: '45px',
    height: '45px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  requestName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  requestDetail: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '2px 0'
  },
  requestDate: {
    fontSize: '13px',
    color: '#6b7280'
  },
  requestDeviceInfo: {
    background: 'white',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '15px'
  },
  requestDeviceId: {
    fontSize: '12px',
    color: '#9ca3af',
    fontFamily: 'monospace'
  },
  requestActions: {
    display: 'flex',
    gap: '10px'
  },
  approveButton: {
    padding: '10px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    flex: 1
  },
  rejectButton: {
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    flex: 1
  },
  deleteButton: {
    padding: '10px 20px',
    background: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px'
  },
  devicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  deviceCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s'
  },
  deviceHeader: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px'
  },
  deviceIcon: {
    fontSize: '32px',
    background: '#f3f4f6',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceInfo: {
    flex: 1
  },
  deviceName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '5px'
  },
  primaryBadge: {
    color: '#3b82f6',
    fontSize: '14px'
  },
  pendingBadge: {
    color: '#f59e0b',
    fontSize: '14px'
  },
  deviceDetail: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '3px'
  },
  pendingMessage: {
    padding: '10px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '600'
  },
  loadingText: {
    textAlign: 'center',
    padding: '30px',
    color: '#6b7280'
  },
  emptyText: {
    textAlign: 'center',
    padding: '30px',
    color: '#9ca3af',
    background: '#f9fafb',
    borderRadius: '8px'
  }
}
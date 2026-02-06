'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import Link from 'next/link'

export default function OpenCoursePage() {
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [price, setPrice] = useState(0)
  const [notes, setNotes] = useState('')
  
  // الحقول الجديدة: فلتر المرحلة
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [availableGrades, setAvailableGrades] = useState<string[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  // تحديث القوائم المفلترة عند تغيير المرحلة
  useEffect(() => {
    if (students.length > 0) {
      let filtered = students
      
      if (selectedGrade !== 'all') {
        filtered = students.filter(student => student.grade === selectedGrade)
      }
      
      setFilteredStudents(filtered)
      
      // إذا كان هناك طالب محدد ولم يكن موجود في القائمة المفلترة، نمسح اختياره
      if (selectedStudent && !filtered.find(s => s.id === selectedStudent)) {
        setSelectedStudent('')
      }
    }
    
    if (courses.length > 0) {
      let filtered = courses
      
      // هنا يمكنك إضافة فلترة الكورسات حسب المرحلة إذا كان لديك حقل grade في الكورسات
      // إذا لم يكن لديك هذا الحقل، يمكنك استخدام منطق مختلف
      // حالياً سأعرض جميع الكورسات إذا كانت المرحلة all
      // ويمكنك تعديل هذا المنطق لاحقاً حسب هيكل بيانات الكورسات لديك
      if (selectedGrade !== 'all') {
        filtered = courses.filter(course => {
          // هنا يجب تعديل الشرط حسب هيكل بيانات الكورسات لديك
          // مثال: إذا كان لديك حقل grade في الكورسات
          // return course.grade === selectedGrade
          return true // مؤقتاً أعرض جميع الكورسات
        })
      }
      
      setFilteredCourses(filtered)
      
      // إذا كان هناك كورس محدد ولم يكن موجود في القائمة المفلترة، نمسح اختياره
      if (selectedCourse && !filtered.find(c => c.id === selectedCourse)) {
        setSelectedCourse('')
      }
    }
  }, [selectedGrade, students, courses, selectedStudent, selectedCourse])

  const fetchData = async () => {
    try {
      setLoading(true)
      setMessage('🔍 جاري تحميل البيانات...')
      
      console.log('=== بدء جلب البيانات ===')
      
      // جلب جميع الطلاب
      console.log('📥 جلب الطلاب...')
      const studentsQuery = query(
        collection(db, "users"),
        where("status", "==", "active")
      )
      const studentsSnap = await getDocs(studentsQuery)
      const studentsList: any[] = []
      const gradesSet = new Set<string>()
      
      studentsSnap.forEach((doc) => {
        const data = doc.data()
        console.log(`👤 طالب: ${data.name} - ${doc.id}`)
        const grade = data.grade || 'غير محدد'
        
        studentsList.push({
          id: doc.id,
          name: data.name || 'غير معروف',
          phone: data.phone || 'بدون رقم',
          grade: grade
        })
        
        gradesSet.add(grade)
      })
      
      // تحويل Set إلى Array وترتيب المراحل
      const gradesArray = Array.from(gradesSet).sort()
      setAvailableGrades(['all', ...gradesArray])
      
      console.log(`✅ عدد الطلاب: ${studentsList.length}`)
      console.log(`📊 المراحل المتاحة: ${gradesArray.join(', ')}`)
      
      // جلب جميع الكورسات
      console.log('📥 جلب الكورسات...')
      const coursesQuery = query(collection(db, "courses"))
      const coursesSnap = await getDocs(coursesQuery)
      const coursesList: any[] = []
      
      coursesSnap.forEach((doc) => {
        const data = doc.data()
        console.log(`📚 كورس: ${data.title} - ${doc.id}`)
        coursesList.push({
          id: doc.id,
          title: data.title || 'بدون عنوان',
          // إذا كان لديك حقل grade في الكورسات، أضفه هنا
          // grade: data.grade || 'غير محدد'
        })
      })
      
      console.log(`✅ عدد الكورسات: ${coursesList.length}`)
      
      setStudents(studentsList)
      setCourses(coursesList)
      setFilteredStudents(studentsList)
      setFilteredCourses(coursesList)
      setMessage(`✅ تم تحميل ${studentsList.length} طالب و ${coursesList.length} كورس`)
      
    } catch (error: any) {
      console.error('❌ خطأ في جلب البيانات:', error)
      console.error('📌 كود الخطأ:', error.code)
      console.error('📌 رسالة الخطأ:', error.message)
      setMessage(`❌ حدث خطأ في جلب البيانات: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCourse = async () => {
    console.log('=== بدء عملية فتح الكورس ===')
    console.log('👤 الطالب المختار:', selectedStudent)
    console.log('📚 الكورس المختار:', selectedCourse)
    console.log('💰 السعر:', price)
    console.log('📝 الملاحظات:', notes)
    console.log('📊 المرحلة المحددة:', selectedGrade)
    
    if (!selectedStudent || !selectedCourse) {
      setMessage('❌ يجب اختيار طالب وكورس')
      return
    }

    const selectedStudentData = students.find(s => s.id === selectedStudent)
    const selectedCourseData = courses.find(c => c.id === selectedCourse)

    console.log('📊 بيانات الطالب:', selectedStudentData)
    console.log('📊 بيانات الكورس:', selectedCourseData)

    if (!selectedStudentData || !selectedCourseData) {
      setMessage('❌ بيانات غير صحيحة')
      return
    }

    const confirmOpen = window.confirm(
      `هل تريد فتح كورس "${selectedCourseData.title}" للطالب "${selectedStudentData.name}"؟`
    )

    if (!confirmOpen) return

    try {
      console.log('🔍 التحقق من وجود الكورس مفتوح مسبقاً...')
      
      // التحقق إذا الكورس مفتوح بالفعل لهذا الطالب
      const existingQuery = query(
        collection(db, "student_courses"),
        where("studentId", "==", selectedStudent),
        where("courseId", "==", selectedCourse),
        where("isActive", "==", true)
      )
      
      const existingSnap = await getDocs(existingQuery)
      
      if (!existingSnap.empty) {
        console.log('⚠️ الكورس مفتوح بالفعل لهذا الطالب')
        setMessage('⚠️ هذا الكورس مفتوح بالفعل للطالب')
        return
      }

      console.log('🚀 جاري فتح الكورس للطالب...')
      
      const newRecord = {
        studentId: selectedStudent,
        courseId: selectedCourse,
        studentName: selectedStudentData.name,
        studentPhone: selectedStudentData.phone,
        courseTitle: selectedCourseData.title,
        isActive: true,
        pricePaid: price || 0,
        notes: notes || 'تم الفتح من لوحة الأدمن',
        openedAt: new Date().toISOString(),
        openedBy: 'admin'
      }
      
      console.log('📝 البيانات المرسلة:', newRecord)
      
      // فتح الكورس للطالب
      const docRef = await addDoc(collection(db, "student_courses"), newRecord)
      
      console.log('✅ تم فتح الكورس بنجاح! Document ID:', docRef.id)
      setMessage(`✅ تم فتح كورس "${selectedCourseData.title}" للطالب "${selectedStudentData.name}" بنجاح`)
      
      // تفريغ الحقول
      setSelectedStudent('')
      setSelectedCourse('')
      setPrice(0)
      setNotes('')
      
      // إعادة تحميل البيانات
      setTimeout(() => fetchData(), 2000)
      
    } catch (error: any) {
      console.error('❌ خطأ في فتح الكورس:', error)
      console.error('📌 كود الخطأ:', error.code)
      console.error('📌 رسالة الخطأ:', error.message)
      
      let errorMsg = '❌ حدث خطأ في فتح الكورس'
      
      if (error.code === 'permission-denied') {
        errorMsg = '❌ ليس لديك صلاحية للإضافة. تحقق من Firestore Rules'
      } else if (error.code === 'not-found') {
        errorMsg = '❌ Collection غير موجود'
      }
      
      setMessage(`${errorMsg}: ${error.message}`)
    }
  }

  const handleBulkOpen = async () => {
    if (!selectedCourse) {
      setMessage('❌ يجب اختيار كورس أولاً')
      return
    }

    const selectedCourseData = courses.find(c => c.id === selectedCourse)
    if (!selectedCourseData) return

    // استخدام الطلاب المفلترين أو جميع الطلاب حسب الاختيار
    const studentsToProcess = selectedGrade === 'all' ? students : filteredStudents

    if (studentsToProcess.length === 0) {
      setMessage('❌ لا يوجد طلاب لعرض الكورس لهم')
      return
    }

    const confirmBulk = window.confirm(
      `هل تريد فتح كورس "${selectedCourseData.title}" لجميع الطلاب؟\nعدد الطلاب: ${studentsToProcess.length}\n${selectedGrade !== 'all' ? `(المرحلة: ${selectedGrade})` : '(جميع المراحل)'}`
    )

    if (!confirmBulk) return

    try {
      setLoading(true)
      setMessage(`🔄 جاري فتح الكورس لـ ${studentsToProcess.length} طالب...`)
      let successCount = 0
      let errorCount = 0
      let alreadyOpenCount = 0

      // فتح الكورس لكل طالب
      for (const student of studentsToProcess) {
        try {
          // التحقق إذا مفتوح بالفعل
          const existingQuery = query(
            collection(db, "student_courses"),
            where("studentId", "==", student.id),
            where("courseId", "==", selectedCourse),
            where("isActive", "==", true)
          )
          
          const existingSnap = await getDocs(existingQuery)
          
          if (existingSnap.empty) {
            await addDoc(collection(db, "student_courses"), {
              studentId: student.id,
              courseId: selectedCourse,
              studentName: student.name,
              studentPhone: student.phone,
              courseTitle: selectedCourseData.title,
              isActive: true,
              pricePaid: price || 0,
              notes: notes || 'فتح جماعي من لوحة الأدمن',
              openedAt: new Date().toISOString(),
              openedBy: 'admin'
            })
            successCount++
            console.log(`✅ فتح الكورس للطالب: ${student.name}`)
          } else {
            alreadyOpenCount++
            console.log(`⚠️ الكورس مفتوح بالفعل للطالب: ${student.name}`)
          }
        } catch (error: any) {
          console.error(`❌ خطأ في فتح الكورس للطالب ${student.name}:`, error)
          errorCount++
        }
      }

      let resultMessage = `✅ تم فتح الكورس لـ ${successCount} طالب`
      if (alreadyOpenCount > 0) resultMessage += `، مفتوح مسبقاً: ${alreadyOpenCount}`
      if (errorCount > 0) resultMessage += `، فشل: ${errorCount}`
      
      setMessage(resultMessage)
      setLoading(false)
      
      // إعادة تحميل البيانات
      setTimeout(() => fetchData(), 3000)
      
    } catch (error: any) {
      console.error('❌ خطأ في الفتح الجماعي:', error)
      setMessage(`❌ حدث خطأ في الفتح الجماعي: ${error.message}`)
      setLoading(false)
    }
  }

  // إضافة هذا الوظيفة لتغيير المرحلة
  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade)
    setMessage(`📊 تم تحديد مرحلة: ${grade === 'all' ? 'جميع المراحل' : grade}`)
  }

  return (
    <div style={styles.container}>
      {/* الهيدر */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/admin" style={styles.backButton}>
            ← العودة للوحة التحكم
          </Link>
          <h1 style={styles.title}>🎓 فتح كورس للطلاب</h1>
          <p style={styles.subtitle}>علمني العلوم مستر بيشوي</p>
        </div>
      </header>

      <main style={styles.main}>
        {/* رسالة Debug */}
        <div style={styles.debugSection}>
          <p style={styles.debugText}>
            ℹ️ افتح Console (F12) لمشاهدة تفاصيل العملية
          </p>
        </div>

        {message && (
          <div style={{
            ...styles.message,
            background: message.startsWith('✅') ? '#d4fae5' : 
                      message.startsWith('⚠️') ? '#fef3c7' : 
                      message.startsWith('🔍') ? '#dbeafe' : 
                      message.startsWith('📊') ? '#e0e7ff' :
                      '#fee2e2',
            color: message.startsWith('✅') ? '#065f46' : 
                   message.startsWith('⚠️') ? '#92400e' : 
                   message.startsWith('🔍') ? '#1e40af' : 
                   message.startsWith('📊') ? '#3730a3' :
                   '#991b1b'
          }}>
            {message}
          </div>
        )}

        <div style={styles.grid}>
          {/* القسم الأيسر: اختيار البيانات */}
          <div style={styles.formSection}>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>📋 اختيار الطالب والكورس</h2>
              
              {/* فلتر المرحلة الجديد */}
              <div style={styles.formGroup}>
                <label style={styles.label}>📊 تصفية حسب المرحلة:</label>
                <div style={styles.gradeFilter}>
                  {availableGrades.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleGradeChange(grade)}
                      style={{
                        ...styles.gradeButton,
                        background: selectedGrade === grade ? '#3b82f6' : '#f3f4f6',
                        color: selectedGrade === grade ? 'white' : '#374151',
                        fontWeight: selectedGrade === grade ? 'bold' : 'normal'
                      }}
                    >
                      {grade === 'all' ? '🌍 جميع المراحل' : `📚 ${grade}`}
                    </button>
                  ))}
                </div>
                <p style={styles.filterInfo}>
                  📌 عرض: {filteredStudents.length} طالب، {filteredCourses.length} كورس
                  {selectedGrade !== 'all' && ` (مرحلة: ${selectedGrade})`}
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>👨‍🎓 اختر الطالب ({filteredStudents.length}):</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  style={styles.select}
                  disabled={loading}
                >
                  <option value="">-- اختر طالبًا --</option>
                  {filteredStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.phone} ({student.grade})
                    </option>
                  ))}
                </select>
                {filteredStudents.length === 0 && (
                  <p style={styles.warningText}>
                    {selectedGrade === 'all' ? '⚠️ لا يوجد طلاب نشطين' : `⚠️ لا يوجد طلاب في مرحلة ${selectedGrade}`}
                  </p>
                )}
                {selectedGrade === 'all' && filteredStudents.length > 0 && (
                  <p style={styles.infoText}>
                    👁️‍🗨️ عرض جميع الطلاب ({filteredStudents.length})، اختر مرحلة للتصفية
                  </p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📚 اختر الكورس ({filteredCourses.length}):</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  style={styles.select}
                  disabled={loading}
                >
                  <option value="">-- اختر كورسًا --</option>
                  {filteredCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {filteredCourses.length === 0 && (
                  <p style={styles.warningText}>⚠️ لا يوجد كورسات</p>
                )}
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>💰 المبلغ المدفوع:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={styles.input}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>📝 ملاحظات:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={styles.textarea}
                  placeholder="ملاحظات إضافية..."
                  rows={3}
                />
              </div>

              <div style={styles.buttonsGroup}>
                <button 
                  onClick={handleOpenCourse}
                  style={styles.primaryButton}
                  disabled={!selectedStudent || !selectedCourse || loading}
                >
                  ✅ فتح الكورس للطالب المحدد
                </button>
                
                <button 
                  onClick={handleBulkOpen}
                  style={styles.secondaryButton}
                  disabled={!selectedCourse || loading || filteredStudents.length === 0}
                >
                  📦 فتح الكورس للطلاب الحاليين
                  {selectedGrade !== 'all' && ` (${selectedGrade})`}
                  <br />
                  <small style={{ fontSize: '12px', opacity: 0.8 }}>
                    {filteredStudents.length} طالب
                  </small>
                </button>
              </div>
            </div>

            {/* تعليمات استكشاف الأخطاء */}
            <div style={styles.instructions}>
              <h3 style={styles.instructionsTitle}>🔧 استكشاف الأخطاء:</h3>
              <ul style={styles.instructionsList}>
                <li><strong>افتح Console (F12)</strong> لمشاهدة التفاصيل</li>
                <li>تأكد من <strong>Firestore Rules</strong> تسمح بالكتابة</li>
                <li>تأكد من وجود collection <strong>student_courses</strong></li>
                <li>تأكد من أن الطلاب status عندهم <strong>active</strong></li>
                <li>تأكد من وجود الكورسات في collection <strong>courses</strong></li>
                <li>**الجديد:** يمكنك تصفية الطلاب والكورسات حسب المرحلة</li>
              </ul>
            </div>
          </div>

          {/* القسم الأيمن: الإحصائيات */}
          <div style={styles.statsSection}>
            <div style={styles.statsCard}>
              <h2 style={styles.statsTitle}>📊 الإحصائيات</h2>
              
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{students.length}</div>
                <div style={styles.statLabel}>جميع الطلاب</div>
              </div>
              
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{filteredStudents.length}</div>
                <div style={styles.statLabel}>طلاب مفلترين</div>
              </div>
              
              <div style={styles.statItem}>
                <div style={styles.statNumber}>{courses.length}</div>
                <div style={styles.statLabel}>جميع الكورسات</div>
              </div>

              <div style={styles.statItem}>
                <div style={{
                  ...styles.statNumber,
                  fontSize: '24px',
                  color: selectedGrade === 'all' ? '#9ca3af' : '#3b82f6'
                }}>
                  {selectedGrade === 'all' ? '🌍 الكل' : `📚 ${selectedGrade}`}
                </div>
                <div style={styles.statLabel}>المرحلة المحددة</div>
              </div>
            </div>

            {/* قائمة سريعة بالطلاب المفلترين */}
            <div style={styles.quickList}>
              <div style={styles.quickListHeader}>
                <h3 style={styles.quickListTitle}>
                  👥 الطلاب ({selectedGrade !== 'all' ? selectedGrade : 'الكل'})
                </h3>
                <span style={styles.counterBadge}>{filteredStudents.length}</span>
              </div>
              <div style={styles.quickListContent}>
                {loading ? (
                  <p style={styles.loadingText}>جاري تحميل الطلاب...</p>
                ) : filteredStudents.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>👤</div>
                    <p style={styles.emptyText}>
                      {selectedGrade === 'all' ? 'لا يوجد طلاب نشطين' : `لا يوجد طلاب في ${selectedGrade}`}
                    </p>
                  </div>
                ) : (
                  <div style={styles.studentsList}>
                    {filteredStudents.slice(0, 8).map(student => (
                      <div key={student.id} style={styles.studentItem}>
                        <span style={styles.studentName}>{student.name}</span>
                        <span style={styles.studentGrade}>{student.grade}</span>
                      </div>
                    ))}
                    {filteredStudents.length > 8 && (
                      <p style={styles.moreText}>و {filteredStudents.length - 8} طالب آخر...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* قائمة سريعة بالكورسات */}
            <div style={styles.quickList}>
              <h3 style={styles.quickListTitle}>📚 الكورسات المتاحة</h3>
              <div style={styles.quickListContent}>
                {loading ? (
                  <p style={styles.loadingText}>جاري تحميل الكورسات...</p>
                ) : filteredCourses.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📚</div>
                    <p style={styles.emptyText}>لا يوجد كورسات</p>
                  </div>
                ) : (
                  <div style={styles.coursesList}>
                    {filteredCourses.map(course => (
                      <div key={course.id} style={styles.courseItem}>
                        <span style={styles.courseTitle}>{course.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* زر التحديث */}
        <div style={styles.refreshSection}>
          <button 
            onClick={fetchData}
            style={styles.refreshButton}
            disabled={loading}
          >
            {loading ? '🔄 جاري التحديث...' : '🔄 تحديث البيانات'}
          </button>
          <p style={styles.helpText}>
            التصفية حسب المرحلة تعمل محلياً ولا تحتاج إعادة تحميل
          </p>
        </div>
      </main>

      {/* الفوتر */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2024 علمني العلوم مستر بيشوي - إدارة فتح الكورسات
          </p>
          <div style={styles.footerLinks}>
            <Link href="/admin" style={styles.footerLink}>لوحة التحكم</Link>
            <Link href="/admin/courses" style={styles.footerLink}>إضافة كورسات</Link>
            <Link href="/admin/students" style={styles.footerLink}>تفعيل طلاب</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// إضافة الأنماط الجديدة
const styles = {
  // ... جميع الأنماط السابقة تبقى كما هي ...
  
  // الأنماط الجديدة المضافة
  gradeFilter: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
    marginBottom: '10px'
  },
  gradeButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  filterInfo: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '5px',
    textAlign: 'center' as const
  },
  infoText: {
    fontSize: '12px',
    color: '#3b82f6',
    marginTop: '5px',
    fontStyle: 'italic' as const
  },
  quickListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  counterBadge: {
    background: '#3b82f6',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'bold' as const
  },
  
  // التأكد من أن جميع الأنماط الأخرى موجودة كما هي
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    direction: 'rtl' as const,
    fontFamily: 'Arial, sans-serif'
  },
  debugSection: {
    background: '#dbeafe',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center' as const
  },
  debugText: {
    color: '#1e40af',
    fontSize: '14px',
    margin: 0
  },
  header: {
    background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
    color: 'white',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center' as const
  },
  backButton: {
    position: 'absolute' as const,
    right: '20px',
    top: '25px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '6px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9
  },
  main: {
    maxWidth: '1400px',
    margin: '30px auto',
    padding: '0 20px'
  },
  message: {
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '25px',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    fontSize: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '25px'
  },
  formCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#1f2937',
    marginBottom: '25px',
    textAlign: 'center' as const
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600' as const,
    color: '#374151',
    fontSize: '15px'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6'
    }
  },
  warningText: {
    color: '#dc2626',
    fontSize: '13px',
    marginTop: '5px',
    fontStyle: 'italic' as const
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6'
    }
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white',
    resize: 'vertical' as const,
    minHeight: '80px',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6'
    }
  },
  buttonsGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginTop: '30px'
  },
  primaryButton: {
    padding: '15px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'background 0.3s',
    '&:hover:not(:disabled)': {
      background: '#059669'
    },
    '&:disabled': {
      background: '#9ca3af',
      cursor: 'not-allowed'
    }
  },
  secondaryButton: {
    padding: '15px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: 'background 0.3s',
    '&:hover:not(:disabled)': {
      background: '#2563eb'
    },
    '&:disabled': {
      background: '#9ca3af',
      cursor: 'not-allowed'
    }
  },
  instructions: {
    background: '#f0f9ff',
    borderRadius: '12px',
    padding: '25px'
  },
  instructionsTitle: {
    fontSize: '20px',
    fontWeight: '600' as const,
    color: '#0369a1',
    marginBottom: '15px'
  },
  instructionsList: {
    margin: 0,
    paddingRight: '20px',
    color: '#0369a1',
    lineHeight: 1.8,
    fontSize: '14px'
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '25px'
  },
  statsCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  statsTitle: {
    fontSize: '20px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  statItem: {
    textAlign: 'center' as const,
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#3b82f6',
    marginBottom: '8px'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '14px'
  },
  quickList: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  quickListTitle: {
    fontSize: '18px',
    fontWeight: '600' as const,
    color: '#1f2937',
    marginBottom: '15px'
  },
  quickListContent: {
    maxHeight: '200px',
    overflowY: 'auto' as const
  },
  loadingText: {
    textAlign: 'center' as const,
    color: '#6b7280',
    padding: '20px'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '20px'
  },
  emptyIcon: {
    fontSize: '2rem',
    color: '#9ca3af',
    marginBottom: '10px'
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '5px'
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: '12px',
    fontStyle: 'italic' as const
  },
  studentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  studentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    background: '#f9fafb',
    borderRadius: '6px'
  },
  studentName: {
    fontWeight: '600' as const,
    color: '#374151'
  },
  studentGrade: {
    color: '#6b7280',
    fontSize: '12px'
  },
  moreText: {
    textAlign: 'center' as const,
    color: '#9ca3af',
    fontSize: '12px',
    marginTop: '10px'
  },
  coursesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  courseItem: {
    padding: '10px',
    background: '#f9fafb',
    borderRadius: '6px'
  },
  courseTitle: {
    color: '#374151'
  },
  refreshSection: {
    textAlign: 'center' as const,
    marginTop: '30px',
    padding: '20px',
    background: '#f8fafc',
    borderRadius: '10px'
  },
  refreshButton: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    marginBottom: '10px',
    '&:disabled': {
      background: '#9ca3af',
      cursor: 'not-allowed'
    }
  },
  helpText: {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '10px'
  },
  footer: {
    background: '#1f2937',
    marginTop: '50px'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
    textAlign: 'center' as const
  },
  footerText: {
    color: '#d1d5db',
    marginBottom: '15px'
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap' as const
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    '&:hover': {
      color: 'white'
    }
  }
}

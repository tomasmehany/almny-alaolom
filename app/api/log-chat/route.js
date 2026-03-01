// app/api/log-chat/route.js
import { put } from '@vercel/blob';

export async function POST(req) {
  console.log("📥 API التسجيل بدأ");
  
  try {
    const body = await req.json();
    console.log("📥 البيانات:", body);

    const { studentId, studentName, realName, message, reply } = body;

    if (!studentId || !message || !reply) {
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    }

    const date = new Date().toISOString().split('T')[0];
    const fileName = `logs/${date}.json`;

    // محاولة جلب الملف الموجود
    let existingLogs = [];
    try {
      const blobUrl = `https://${process.env.BLOB1_READ_WRITE_TOKEN}.public.blob.vercel-storage.com/${fileName}`;
      const existingRes = await fetch(blobUrl);
      if (existingRes.ok) {
        existingLogs = await existingRes.json();
      }
    } catch (error) {
      console.log("ملف جديد سيتم إنشاؤه");
    }

    // إضافة السجل الجديد
    const newLog = {
      id: Date.now(),
      studentId,
      studentName: studentName || 'طالب',
      realName: realName || 'غير معروف',
      message,
      reply,
      timestamp: new Date().toISOString()
    };
    
    existingLogs.push(newLog);

    // حفظ الملف في Vercel Blob
    const blob = await put(fileName, JSON.stringify(existingLogs, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB1_READ_WRITE_TOKEN,
    });

    console.log("✅ تم الحفظ في:", blob.url);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("❌ خطأ:", error);
    return new Response(JSON.stringify({ success: false }), { status: 200 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "API log-chat is working" }), { status: 200 });
}

// app/api/log-chat/route.js
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  console.log("📥 API التسجيل بدأ");
  
  try {
    const body = await req.json();
    console.log("📥 البيانات:", body);

    const { studentId, studentName, message, reply } = body;

    if (!studentId || !message || !reply) {
      console.log("❌ بيانات ناقصة");
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    }

    const logsDir = path.join(process.cwd(), 'logs');
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${today}.json`);

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    let logs = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      logs = JSON.parse(content);
    }

    const newLog = {
      id: Date.now(),
      studentId,
      studentName: studentName || 'طالب',
      message,
      reply,
      timestamp: new Date().toISOString()
    };
    
    logs.push(newLog);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    console.log("✅ تم الحفظ");

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("❌ خطأ:", error);
    return new Response(JSON.stringify({ success: false }), { status: 200 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "API log-chat is working" }), { status: 200 });
}

// app/api/chat/route.js
export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiKey = "AIzaSyAPy0fIJBNiSURztO0NiEY5YorfMQ7w-rA";
    
    // ✅ استخدام النموذج الأحدث (2.5-flash)
    const model = "gemini-2.5-flash";
    
    // ✅ تعليمات محسنة:
    // 1. ممنوع استخدام النجوم (**)
    // 2. استخدام الأقواس بدلاً من النجوم
    // 3. تفاصيل مناسبة (متوسطة)
    const prompt = `أنت Almny Alolom AI، بوت تعليمي متخصص.

تعليمات مهمة للرد:
- ممنوع استخدام النجوم ** نهائياً
- استخدم الأقواس للتوضيح بدلاً من النجوم
- اكتب إجابة متوسطة الطول (أكثر من كلمة ولكن ليست موسوعة)
- استخدم لغة عربية بسيطة
- إذا احتجت توضيح، استخدم (الأقواس)

السؤال: ${message}

الإجابة:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await response.json();
    
    // ✅ استخراج النص
    let replyText = "عذراً، لم أستطع الإجابة";
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      replyText = data.candidates[0].content.parts[0].text;
      
      // ✅ تنظيف إضافي للنجوم (لو فاتت البوت)
      replyText = replyText.replace(/\*\*(.*?)\*\*/g, '($1)'); // **نص** -> (نص)
      replyText = replyText.replace(/\*(.*?)\*/g, '($1)');     // *نص* -> (نص)
    }

    // ✅ تحويل الصيغ الكيميائية
    replyText = replyText.replace(/H2O/g, 'H<sub>2</sub>O');
    replyText = replyText.replace(/CO2/g, 'CO<sub>2</sub>');

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("❌ خطأ:", error);
    return new Response(JSON.stringify({
      reply: "عذراً، حدث خطأ مؤقت"
    }), { status: 200 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "✅ API شغال!" }), {
    status: 200
  });
}

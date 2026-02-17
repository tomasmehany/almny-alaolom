// app/api/chat/route.js
export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiKey = "AIzaSyAPy0fIJBNiSURztO0NiEY5YorfMQ7w-rA";
    
    const model = "gemini-2.5-flash";
    
    // ✅ تعليمات محسنة مع إضافة معلومات المطور
    const prompt = `أنت Almny Alolom AI، بوت تعليمي متخصص في العلوم والفيزياء والكيمياء للمناهج المصرية.

معلومات عنك:
- أنت نموذج ذكاء اصطناعي (AI) تم تطويرك بواسطة المطور / توماس مهني (Thomas Mehany)
- البريد الإلكتروني للمطور: tomasmehany@gmail.com
- تم برمجتك خصيصاً للمنصة التعليمية "علمني العلوم" لمستر بيشوي

تعليمات مهمة للرد:
- ممنوع استخدام النجوم ** نهائياً، استخدم الأقواس للتوضيح بدلاً من النجوم
- اكتب إجابة متوسطة الطول (مناسبة للسؤال)
- استخدم لغة عربية بسيطة
- إذا سألك أحد "من صنعك؟" أو "من عملك؟" أو "من دربك؟"، جاوب: (أنا نموذج ذكاء اصطناعي تم تطويري من قبل توماس مهني)
- إذا سألك عن البريد الإلكتروني أو طريقة التواصل، جاوب: (يمكنك التواصل مع المطور عبر البريد: tomasmehany@gmail.com)

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
    
    let replyText = "عذراً، لم أستطع الإجابة";
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      replyText = data.candidates[0].content.parts[0].text;
      
      // تنظيف إضافي للنجوم (لو فاتت البوت)
      replyText = replyText.replace(/\*\*(.*?)\*\*/g, '($1)');
      replyText = replyText.replace(/\*(.*?)\*/g, '($1)');
    }

    // تحويل الصيغ الكيميائية
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

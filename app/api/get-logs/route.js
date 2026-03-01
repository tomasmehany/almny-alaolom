// app/api/get-logs/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const fileName = `logs/${date}.json`;
    const blobUrl = `https://${process.env.BLOB1_READ_WRITE_TOKEN}.public.blob.vercel-storage.com/${fileName}`;
    
    const res = await fetch(blobUrl);
    
    if (!res.ok) {
      return new Response(JSON.stringify({ logs: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const logs = await res.json();

    return new Response(JSON.stringify({ logs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("❌ خطأ في جلب السجلات:", error);
    return new Response(JSON.stringify({ logs: [] }), { status: 200 });
  }
}

'use client'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // كشف الموبايل
    const isMobile = window.innerWidth <= 768
    
    if (isMobile) {
      // غير الـ viewport بتاع الموبايل بس
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute('content', 'width=1024, initial-scale=0.5, maximum-scale=1.5, user-scalable=yes')
      } else {
        // لو مش لاقي الميتا، اضيفها
        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=1024, initial-scale=0.5, maximum-scale=1.5, user-scalable=yes'
        document.head.appendChild(meta)
      }
    }
  }, [])

  return (
    <html lang="ar" translate="no">
      <head>
        {/* دا للابتوب */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}

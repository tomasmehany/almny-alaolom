// app/layout.tsx
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({ 
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'علمني العلوم | منصة مستر بيشوي التعليمية',
    template: '%s | علمني العلوم'
  },
  description: 'منصة علمني العلوم التعليمية مع مستر بيشوي - دروس وكورسات في الكيمياء والفيزياء والعلوم للمراحل الإعدادية والثانوية',
  keywords: [
    'علمني العلوم',
    'مستر بيشوي',
    'منصة تعليمية',
    'كيمياء',
    'فيزياء',
    'علوم',
    'دروس خصوصية',
    'المرحلة الإعدادية',
    'المرحلة الثانوية',
    'تعليم عن بعد',
    'منصة تعليمية مصرية'
  ],
  authors: [{ name: 'مستر بيشوي' }],
  creator: 'توماس مهني',
  publisher: 'علمني العلوم',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'EnJDNgIGDkDT_W6IcBzqbI5Ub7nhlzSXGZaZn4DJaMc', // 👈 هات الكود من Google Search Console وحطه هنا
  },
  openGraph: {
    title: 'علمني العلوم | منصة مستر بيشوي التعليمية',
    description: 'منصة علمني العلوم التعليمية مع مستر بيشوي - دروس وكورسات في الكيمياء والفيزياء والعلوم',
    url: 'https://almny-alaolom.vercel.app',
    siteName: 'علمني العلوم',
    images: [
      {
        url: 'https://almny-alaolom.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'علمني العلوم | منصة مستر بيشوي التعليمية',
    description: 'منصة علمني العلوم التعليمية مع مستر بيشوي',
    images: ['https://almny-alaolom.vercel.app/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://almny-alaolom.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="theme-color" content="#0a192f" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cairo.className}>{children}</body>
    </html>
  )
}

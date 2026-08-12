// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/teacher/'],
    },
    sitemap: 'https://almny-alaolom.vercel.app/sitemap.xml',
  }
}
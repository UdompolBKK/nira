// Dynamic sitemap.xml generator
import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const db = adminFirestore()

  // Static routes
  const staticRoutes = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/browse', priority: 0.9, changefreq: 'daily' },
    { url: '/articles', priority: 0.8, changefreq: 'weekly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/pricing', priority: 0.8, changefreq: 'monthly' },
    { url: '/stories', priority: 0.9, changefreq: 'daily' },
    { url: '/problems', priority: 0.9, changefreq: 'daily' },
    { url: '/login', priority: 0.5, changefreq: 'monthly' },
    { url: '/signup', priority: 0.5, changefreq: 'monthly' }
  ]

  // Fetch public posts from Firestore
  const postsSnapshot = await db
    .collection('storyPosts')
    .where('visibility', '==', 'public')
    .orderBy('createdAt', 'desc')
    .limit(1000) // Limit for performance
    .get()

  const postRoutes = postsSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      url: `/posts/${doc.id}`,
      priority: 0.6,
      changefreq: 'weekly',
      lastmod: data.updatedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date()
    }
  })

  // Fetch user profiles with slugs
  const usersSnapshot = await db
    .collection('users')
    .where('slug', '!=', null)
    .limit(500)
    .get()

  const profileRoutes = usersSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      url: `/profile/${data.slug}`,
      priority: 0.5,
      changefreq: 'weekly',
      lastmod: data.updatedAt?.toDate?.() || new Date()
    }
  })

  // Combine all routes
  const allRoutes = [...staticRoutes, ...postRoutes, ...profileRoutes]

  // Generate XML
  const hostname = 'https://บันทึกนิรนาม.com'
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => {
  const lastmod = route.lastmod ? `
  <lastmod>${route.lastmod.toISOString()}</lastmod>` : ''

  return `  <url>
    <loc>${hostname}${route.url}</loc>${lastmod}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
}).join('\n')}
</urlset>`

  // Set headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour

  return xml
})

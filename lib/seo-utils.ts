import { getPressReleases } from './press-releases'

/**
 * Generate structured data for press releases (JSON-LD)
 */
export function generatePressReleaseStructuredData(release: any) {
  const baseUrl = 'https://newstoday.au' // Replace with your actual domain
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: release.title,
    description: release.subtitle || release.content.substring(0, 160),
    image: release.imageUrl ? [release.imageUrl] : [],
    datePublished: release.publishedAt?.toISOString(),
    dateModified: release.publishedAt?.toISOString(),
    author: {
      '@type': 'Organization',
      name: release.company,
      contactPoint: {
        '@type': 'ContactPoint',
        email: release.contactEmail,
        telephone: release.contactPhone,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'News Today',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`, // Add your logo
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/releases/${release.slug}`,
    },
    articleSection: release.category,
    keywords: release.category,
  }
}

/**
 * Generate XML sitemap for press releases (for external tools)
 */
export async function generatePressReleaseSitemap(): Promise<string> {
  const baseUrl = 'https://newstoday.au' // Replace with your actual domain
  
  try {
    const pressReleases = await getPressReleases(1000)
    
    const urls = pressReleases.map(release => {
      const lastmod = release.publishedAt || release.createdAt
      return `
  <url>
    <loc>${baseUrl}/releases/${release.slug}</loc>
    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/releases</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urls}
</urlset>`
  } catch (error) {
    console.error('Error generating press release sitemap:', error)
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  }
}

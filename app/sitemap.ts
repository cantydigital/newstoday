import { MetadataRoute } from 'next'
import { getPressReleasesForSitemap } from '@/lib/press-releases'
import { blog } from './blog/lib/blog-client'

async function getBlogPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await blog.getSitemapEntries()
    return [
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...entries.map((entry) => ({
        url: `${baseUrl}/blog/${entry.slug}`,
        lastModified: entry.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]
  } catch (error) {
    console.error('Error fetching blog articles for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://newstoday.au'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/releases`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/editorial`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  try {
    // Get published press releases (lightweight query with only slug and dates)
    const pressReleases = await getPressReleasesForSitemap()
    
    // Create sitemap entries for press releases
    const pressReleasesPages: MetadataRoute.Sitemap = pressReleases.map((release) => ({
      url: `${baseUrl}/releases/${release.slug}`,
      lastModified: release.publishedAt || release.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...pressReleasesPages, ...(await getBlogPages(baseUrl))]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if there's an error fetching press releases
    return staticPages
  }
}

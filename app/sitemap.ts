import { MetadataRoute } from 'next'
import { getPressReleases } from '@/lib/press-releases'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://newstoday.com.au'
  
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
    // Get all published press releases
    const pressReleases = await getPressReleases(1000) // Get a large number to include all
    
    // Create sitemap entries for press releases
    const pressReleasesPages: MetadataRoute.Sitemap = pressReleases.map((release) => ({
      url: `${baseUrl}/releases/${release.slug}`,
      lastModified: release.publishedAt || release.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...pressReleasesPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if there's an error fetching press releases
    return staticPages
  }
}

import type React from "react"
import type { Metadata } from "next"
import { Geist, Crimson_Text } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: {
    default: "News Today - Australia's Trusted Press Release Service",
    template: "%s | News Today"
  },
  description:
    "Publish your press releases across Australia in minutes. News Today is a reliable press release service that helps businesses publish, promote, and get media coverage easily.",
  keywords: [
    "press release",
    "Australia",
    "news distribution",
    "media coverage",
    "business news",
    "press release service",
    "Australian media",
    "news today",
    "press release distribution",
    "media outreach"
  ],
  authors: [{ name: "News Today" }],
  creator: "News Today",
  publisher: "News Today",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://newstoday.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://newstoday.com.au',
    title: "News Today - Australia's Trusted Press Release Service",
    description: "Publish your press releases across Australia in minutes. News Today is a reliable press release service that helps businesses publish, promote, and get media coverage easily.",
    siteName: 'News Today',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'News Today - Press Release Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "News Today - Australia's Trusted Press Release Service",
    description: "Publish your press releases across Australia in minutes. News Today is a reliable press release service that helps businesses publish, promote, and get media coverage easily.",
    images: ['/og-image.jpg'],
    creator: '@newstoday_au',
  },
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/apple-icon',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "News Today",
    "url": "https://newstoday.com.au",
    "logo": "https://newstoday.com.au/logo.png",
    "description": "Australia's trusted press release distribution service helping businesses get media coverage across the country.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressRegion": "Australia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+61-XXX-XXX-XXX",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://twitter.com/newstoday_au",
      "https://linkedin.com/company/newstoday-au"
    ],
    "service": {
      "@type": "Service",
      "name": "Press Release Distribution",
      "description": "Professional press release distribution service across Australia's media network",
      "provider": {
        "@type": "Organization",
        "name": "News Today"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      }
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${_crimsonText.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

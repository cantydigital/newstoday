import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Submit Your Press Release - Get Published on News Today",
  description: "Submit your press release to News Today and get published across Australia's media network. Fast, easy, and professional press release submission service.",
  keywords: [
    "submit press release",
    "press release submission",
    "publish press release Australia",
    "news submission",
    "media submission Australia",
    "press release form",
    "business news submission"
  ],
  openGraph: {
    title: "Submit Your Press Release - Get Published on News Today",
    description: "Submit your press release to News Today and get published across Australia's media network. Fast, easy, and professional press release submission service.",
    url: 'https://newstoday.com.au/submit',
    type: 'website',
    images: [
      {
        url: '/og-submit.jpg',
        width: 1200,
        height: 630,
        alt: 'Submit Press Release - News Today',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Submit Your Press Release - Get Published on News Today",
    description: "Submit your press release to News Today and get published across Australia's media network. Fast, easy, and professional press release submission service.",
    images: ['/og-submit.jpg'],
  },
  alternates: {
    canonical: 'https://newstoday.com.au/submit',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

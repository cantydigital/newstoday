/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig

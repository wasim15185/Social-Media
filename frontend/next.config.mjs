/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // ← Only HTTPS for better security
        hostname: "**", // ← Wildcard: allows ANY domain
      },
      {
        protocol: "http", // ← Only HTTP  for better security
        hostname: "**", // ← Wildcard: allows ANY domain
      },
    ],

    /**
     * Allow loading images from localhost/private IP
     */
    dangerouslyAllowLocalIP: true,
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/AuthenticatePlease',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're deploying statically
  trailingSlash: true,
}

module.exports = nextConfig 
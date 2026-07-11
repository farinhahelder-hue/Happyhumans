/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com https://assets.calendly.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://happyhumans.vercel.app https://behold.pictures https://cdn2.behold.pictures https://*.calendly.com",
      "font-src 'self' https://api.fontshare.com https://fonts.gstatic.com",
      "frame-src 'self' https://calendly.com https://*.calendly.com",
      "connect-src 'self' https://*.supabase.co https://api.perplexity.ai https://api.unsplash.com https://api.bufferapp.com https://calendly.com https://*.calendly.com",
      // 'self' (au lieu de 'none') : permet l'aperçu iframe du site dans /cms-admin
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'd2xsxph8kpxj0f.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'heldonica.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.heldonica.fr',
      },
      {
        protocol: 'https',
        hostname: 'happyhumans.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'behold.pictures',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.behold.pictures',
      },
    ],
  },
  compress: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    optimizePackageImports: ['lodash'],
  },
  staticPageGenerationTimeout: 300,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  async redirects() {
    return [
      { source: '/admin', destination: '/cms-admin', permanent: true },
      { source: '/admin/:path*', destination: '/cms-admin/:path*', permanent: true },
      { source: '/planifier', destination: '/coaching', permanent: true },
      { source: '/travel-planning', destination: '/coaching', permanent: true },
      { source: '/travel-planning-form', destination: '/contact', permanent: true },
      { source: '/hotel-consulting', destination: '/entreprises', permanent: true },
      { source: '/ai-hotellerie', destination: '/entreprises', permanent: true },
      { source: '/etudes-de-cas', destination: '/entreprises', permanent: true },
      // /blog est une vraie page — pas de redirect
      { source: '/destinations', destination: '/', permanent: true },
      { source: '/destinations/:path*', destination: '/', permanent: true },
      { source: '/slow-travel', destination: '/', permanent: true },
      // /temoignages est une vraie page — pas de redirect
      { source: '/travel-planner', destination: '/coaching', permanent: true },
      { source: '/travel-planner/', destination: '/coaching', permanent: true },
      { source: '/nos-services', destination: '/coaching', permanent: true },
      { source: '/nos-services/', destination: '/coaching', permanent: true },
      { source: '/sujets/bons-plans', destination: '/', permanent: true },
      { source: '/sujets/bons-plans/', destination: '/', permanent: true },
      { source: '/sujets/:slug', destination: '/', permanent: true },
      { source: '/etiquettes/:slug', destination: '/', permanent: true },
      { source: '/stoos-ridge-notre-aventure-sur-la-crete-panoramique-2', destination: '/', permanent: true },
    ];
  },
}

module.exports = nextConfig

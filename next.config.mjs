/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },

  // forms.leanprotocol.in serves the /users questionnaire at its root.
  // beforeFiles runs ahead of filesystem routing, which is required here:
  // the plain array form runs after Next resolves '/' to the homepage,
  // so the rewrite would never fire.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: '(?<host>forms\\.leanprotocol\\.in.*)' }],
          destination: '/users',
        },
      ],
    }
  },
}

export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },
  // Subdomain roots. beforeFiles runs ahead of filesystem routing, which is
  // required here: the plain array form runs after Next resolves '/' to the
  // homepage, so these rewrites would never fire.
  //   forms.leanprotocol.in     -> the /users questionnaire
  //   pro.leanprotocol.in       -> the redesigned campaign page at /pro
  //   challenge.leanprotocol.in -> the /challenge campaign, whole path tree
  //
  // The challenge subdomain needs two rules. '/:path*' does not reliably
  // match the bare root in Next, so the root gets its own explicit entry.
  // It sits last, so /checkout and /unlock resolve through the path rule
  // first and only '/' falls through to it.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: '(?<host>forms\\.leanprotocol\\.in.*)' }],
          destination: '/users',
        },
        {
          source: '/',
          has: [{ type: 'host', value: '(?<host>pro\\.leanprotocol\\.in.*)' }],
          destination: '/pro',
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: '(?<host>challenge\\.leanprotocol\\.in.*)' }],
          destination: '/challenge/:path*',
        },
        {
          source: '/',
          has: [{ type: 'host', value: '(?<host>challenge\\.leanprotocol\\.in.*)' }],
          destination: '/challenge',
        },
      ],
    }
  },
}

export default nextConfig

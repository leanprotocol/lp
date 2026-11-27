/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },
  // Screens that are not for search results: sign-in, account, affiliate, admin
  // and the blog editor. The header asks search engines not to list them.
  // Visitors, ads and the screens themselves are not affected.
  async headers() {
    const hidden = [{ key: 'X-Robots-Tag', value: 'noindex' }]
    return [
      '/login',
      '/forgot-password',
      '/welcome',
      '/dashboard',
      '/quiz',
      '/affiliate',
      '/affiliate/:path*',
      '/get-started/affiliate',
      '/admin',
      '/admin/:path*',
      '/studio',
      '/studio/:path*',
    ].map((source) => ({ source, headers: hidden }))
  },
  // Subdomain roots. beforeFiles runs ahead of filesystem routing, which is
  // required here: the plain array form runs after Next resolves '/' to the
  // homepage, so these rewrites would never fire.
  //   forms.leanprotocol.in and enquire.leanprotocol.in -> the /users questionnaire
  //   pro.leanprotocol.in       -> the redesigned campaign page at /pro
  //   challenge.leanprotocol.in -> the /challenge campaign, whole path tree
  //
  // The challenge subdomain needs two rules. '/:path*' does not reliably
  // match the bare root in Next, so the root gets its own explicit entry.
  // It sits last, so /checkout and /unlock resolve through the path rule
  // first and only '/' falls through to it.
  // /bg-dashboard is retired: its team has left. Redirects run before pages and
  // rewrites, so the page cannot be reached on any domain. Temporary (307), so it
  // can be reversed without browsers caching it.
  async redirects() {
    return [
      { source: '/bg-dashboard', destination: '/', permanent: false },
      { source: '/bg-dashboard/:path*', destination: '/', permanent: false },
      // /masterclass is removed. The course people buy is at /course, so old
      // links land there.
      { source: '/masterclass', destination: '/course', permanent: false },
      { source: '/masterclass/:path*', destination: '/course', permanent: false },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: '(?<host>(?:forms|enquire)\\.leanprotocol\\.in.*)' }],
          destination: '/users',
        },
                {
          source: '/page:n(\\d+)',
          has: [{ type: 'host', value: '(?<host>(?:forms|enquire)\\.leanprotocol\\.in.*)' }],
          destination: '/users',
        },
        {
          source: '/talk-to-health-coach',
          has: [{ type: 'host', value: '(?<host>(?:forms|enquire)\\.leanprotocol\\.in.*)' }],
          destination: '/talk-to-health-coach',
        },
        {
          source: '/course',
          has: [{ type: 'host', value: '(?<host>(?:forms|enquire)\\.leanprotocol\\.in.*)' }],
          destination: '/course-quiz',
        },
        {
          source: '/thankyou',
          has: [{ type: 'host', value: '(?<host>(?:forms|enquire)\\.leanprotocol\\.in.*)' }],
          destination: '/users/thankyou',
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

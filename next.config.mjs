/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },

  /**
   * forms.leanprotocol.in serves the /users questionnaire at its root.
   *
   * This is a rewrite, not a redirect: the browser URL stays
   * https://forms.leanprotocol.in with no visible /users path.
   * A redirect would change the URL after the ad click, which risks a
   * Google Ads destination-mismatch review.
   *
   * Both the bare host and the www variant are matched, in case the
   * subdomain is ever reached with a www prefix.
   */
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'forms.leanprotocol.in' }],
        destination: '/users',
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'www.forms.leanprotocol.in' }],
        destination: '/users',
      },
    ]
  },
}

export default nextConfig

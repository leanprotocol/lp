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
  //   forms.leanprotocol.in -> the /users questionnaire
  //   pro.leanprotocol.in   -> the redesigned campaign page at /pro
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
      ],
    }
  },
}
export default nextConfig
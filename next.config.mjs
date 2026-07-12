/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_MOCKAPI_URL:
      process.env.NEXT_PUBLIC_MOCKAPI_URL ??
      'https://6872f93c46b4e7f718e3d1e7.mockapi.io/api/v1',
  },
};

export default nextConfig;

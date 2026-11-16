/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.sslip.io' },
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_URL:
      process.env.NEXT_PUBLIC_STRAPI_URL || "https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io",
    NEXT_PUBLIC_STRAPI_MEDIA_URL:
      process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "https://jyotishveda-strapi-8f1717-150-136-44-53.sslip.io",
    NEXT_PUBLIC_RAZORPAY_KEY_ID:
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Sx9dDPssrGbVKO",
  },
};

export default nextConfig;

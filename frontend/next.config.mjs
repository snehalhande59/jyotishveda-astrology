/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "localhost",
      "jyotishveda-backend-0epp.onrender.com",
    ],
  },
  env: {
    NEXT_PUBLIC_STRAPI_URL:
      process.env.NEXT_PUBLIC_STRAPI_URL || "https://jyotishveda-backend-0epp.onrender.com",
    NEXT_PUBLIC_STRAPI_MEDIA_URL:
      process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "https://jyotishveda-backend-0epp.onrender.com",
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co", "fakestoreapi.com", "lh3.googleusercontent.com"],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

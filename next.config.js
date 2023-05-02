/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "fakestoreapi.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "appymeal.net",
    ],
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    FIREBASE_API_KEY: process.env.API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.APP_ID,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

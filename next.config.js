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
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    FIREBASE_API_KEY: process.env.FRBSE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FRBSE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FRBSE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FRBSE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FRBSE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FRBSE_APP_ID,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

module.exports = nextConfig;

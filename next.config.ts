/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://172.17.213.32:3000"],
  },
};

module.exports = nextConfig;
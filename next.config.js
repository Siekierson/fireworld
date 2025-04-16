/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: false
    }
  },
  srcDir: 'src',
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

module.exports = nextConfig;

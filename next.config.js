
/** @type {import('next').NextConfig} */
require('./tracing/init');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
};

module.exports = nextConfig;

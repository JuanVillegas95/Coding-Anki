/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      config.ignoreWarnings = [
        (warning) =>
          typeof warning.message === 'string' &&
          warning.message.includes('Extra attributes from the server: cz-shortcut-listen'),
      ];
    }

    return config;
  },
};

export default nextConfig;

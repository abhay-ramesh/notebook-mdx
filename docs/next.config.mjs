import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Add loader for .ipynb files to enable direct import in MDX
    config.module.rules.push({
      test: /\.ipynb$/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    });

    // Add .ipynb to resolvable extensions
    config.resolve.extensions.push('.ipynb');

    return config;
  },
};

export default withMDX(config);

import createMDX from '@next/mdx'
import CopyPlugin from 'copy-webpack-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
    ],
  },
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /(all.json|\.whl)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/pypi/[name][ext]',
      },
    })

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/mathlive/dist/fonts',
            to: 'static/fonts/',
          },
          {
            from: './node_modules/@eurekapad/swiftlatex/dist/swiftlatex*.{wasm,js}',
            to: 'static/swiftlatex/[name][ext]',
          },
        ],
      }),
    )
    return config
  },
  compiler: {
    styledComponents: true,
  },
  swcMinify: false,
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

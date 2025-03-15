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
  experimental: {
    reactCompiler: true,
  },

  // This is required to support PostHog reverse proxy
  // https://posthog.com/docs/advanced/proxy/nextjs
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://eu.i.posthog.com/decide',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

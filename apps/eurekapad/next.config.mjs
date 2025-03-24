import {withSentryConfig} from '@sentry/nextjs';
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
export default withSentryConfig(withMDX(nextConfig), {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "eurekapad",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});
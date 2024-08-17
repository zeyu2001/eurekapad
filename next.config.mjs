import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
      domains: [
        "files.edgestore.dev"
      ]
    },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /pypi\/.*/,
      type: 'asset/resource',
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: "/static/pypi",
          }
        }
      ]
    })
    return config
  },
  compiler: {
    styledComponents: true
  }
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)
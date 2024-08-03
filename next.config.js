/** @type {import('next').NextConfig} */
const nextConfig = {
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
module.exports = nextConfig

import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      },
    ],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /(all.json|\.whl)$/,
      type: "asset/resource",
      generator: {
        filename: "static/pypi/[name][ext]",
      },
    });
    return config;
  },
  compiler: {
    styledComponents: true,
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

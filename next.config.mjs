/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack(config) {
      config.resolve.extensionAlias = {
        ".js": [".js", ".ts"],
      };
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "api.universalprofile.cloud",
          port: "",
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  
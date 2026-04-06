import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许局域网 IP 访问 dev server 资源（HMR 等）
  allowedDevOrigins: ["192.168.3.32"],
};

export default nextConfig;

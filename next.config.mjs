/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;

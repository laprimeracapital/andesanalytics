/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    allowedDevOrigins: [
        "192.168.18.10"
    ],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.net",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "bjokdminlggemjtweeby.supabase.co",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;

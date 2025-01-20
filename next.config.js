/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  }, 
  images: {
    domains: ['lh3.googleusercontent.com','symphonylimited.com','www.costway.co.uk','i.pinimg.com','www.carnivalworld.sg','kamziksepticandportabletoilets.com','5.imimg.com','banner2.cleanpng.com','assets.sealeyb2b.co.uk', 'canonpk.com','images.unsplash.com', 'static.wixstatic.com', 'media.istockphoto.com','upload.wikimedia.org', 'www.istockphoto.com', 'm.media-amazon.com', 'unsplash.com'],
  },
};

module.exports = nextConfig;
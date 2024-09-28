/** @type {import('next').NextConfig} */
// const nextConfig = ()=>{};


const  nextConfig=({  
    reactStrictMode: true,  
    swcMinify: true,  
    webpack(config) {  
      config.module.rules.push({  
        test: /\.svg$/,  
        use: [  
          {  
            loader: '@svgr/webpack',  
            options: {  
              icon: true, // Optional: Set to true if you want to use SVG as an icon  
            },  
          },  
        ],  
      });  
      return config;  
    },  
  });  



export default nextConfig;

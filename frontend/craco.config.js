  devServer: {\n    proxy: {\n      \'/api\': {\n        target: process.env.REACT_APP_BACKEND_URL || \'http://localhost:8001\',\n        changeOrigin: true,\n        pathRewrite: { \'^\/api\': \'\' },\n      },\n    },\n    port: 3000,\n  },

// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      
      return webpackConfig;
    },
  },
};
  

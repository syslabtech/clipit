module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
        changeOrigin: true,
        pathRewrite: { '/api': '' },
      },
    },
    port: 3000,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      
      return webpackConfig;
    },
  },
};
  

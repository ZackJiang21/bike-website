'use strict'
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = 'G42 Bike Fitting';
const port = 8081;

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/dev-api': {
        target: 'http://10.111.137.125:5000',
        changeOrigin: true,
        pathRewrite: {
          ['^/dev-api']: ''
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
};

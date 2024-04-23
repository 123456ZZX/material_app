/*
 * @Author: xie_sm
 * @Date: 2022-02-28 16:07:02
 * @LastEditors: xie_sm
 * @LastEditTime: 2022-05-13 09:50:53
 * @FilePath: \mobile-template\vue.config.js
 * @Description:
 *
 */
/* eslint-disable no-param-reassign */
const path = require('path')
// const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const defaultSettings = require('./src/settings')

const port = '8088'
const isProduction = process.env.NODE_ENV !== 'development'
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
// 默认打包时移除console和debugger，调试时可关闭
const removeProdDebug = true

// 默认开启代码体积可视化分析工具
const enableAnalyzer = true

module.exports = {
  // 开启eslint检查
  lintOnSave: true,
  devServer: {
    port,
    proxy: defaultSettings.proxy,
  },
  publicPath: './',
  // outputDir: '../www',
  assetsDir: '',
  // 不需要生产环境的 source map，开启设置为true
  productionSourceMap: false,
  configureWebpack: {
    // 解决开发环境debugger语句定位异常
    devtool: 'eval-source-map',
    // 配置别名
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '@views': path.join(__dirname, './src/views'),
        '@components': path.join(__dirname, './src/components'),
        '@store': path.join(__dirname, './src/store'),
        '@assets': path.join(__dirname, './src/assets'),
        '@utils': path.join(__dirname, './src/utils'),
        '@common': path.join(__dirname, './src/common'),
      },
    },
    module: {},
    // 可查看webpack官网了解详细参数说明，
    // https://v4.webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
    optimization: (function () {
      return isProduction
        ? {
            splitChunks: {
              chunks: 'all',
              minSize: 20000,
              maxSize: 250000,
              minChunks: 1,
              maxAsyncRequests: 30,
              maxInitialRequests: 30,
              enforceSizeThreshold: 50000,
              cacheGroups: {
                defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  reuseExistingChunk: true,
                },
                default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true,
                },
              },
            },
          }
        : {}
    })(),
  },
  chainWebpack: (config) => {
    // 修改html中的title值
    config.plugin('html').tap((args) => {
      args[0].title = '容东片区智能水务运维管理平台系统'
      return args
    })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 10240 }))
    // 压缩静态资源文件
    if (isProduction) {
      // ios端暂不支持gzip格式，先屏蔽
      // config.plugin("compressionPlugin").use(
      //   new CompressionPlugin({
      //     filename: "[path].gz[query]",
      //     algorithm: "gzip",
      //     test: productionGzipExtensions,
      //     threshold: 10240,
      //     minRatio: 0.8,
      //     deleteOriginalAssets: true,
      //   })
      // );
      if (removeProdDebug) {
        config.optimization.minimizer('terser').tap((args) => {
          // 去除生产环境console和debugger
          args[0].terserOptions.compress.drop_console = true
          args[0].terserOptions.compress.drop_debugger = true
          return args
        })
      }

      if (enableAnalyzer) {
        // 可视化分析工具，打包完成后会自行在浏览器窗口打开结果
        config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
      }
    }
  },
  css: {
    // 屏蔽打包时组件样式的顺序警告——https://github.com/youzan/vant/issues/6486
    extract: {
      ignoreOrder: true,
    },
  },
}

const publicPath = process.env.NODE_ENV === "production" ? "/" : "/";

module.exports = {
  publicPath: publicPath,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  // lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/arch": {
        // 目标 API 地址
        // target: 'http://192.168.0.75:8085/',  // 锦荣电脑IP
        target: 'http://192.168.0.108:8085/',  // 增文电脑IP
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          "^/arch": "/arch"
        }
      }
    }
  }
};

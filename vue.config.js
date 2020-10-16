/*
 * @Author: CiFong
 * @Date: 2020-04-03 13:51:19
 * @LastEditors: CiFong
 * @LastEditTime: 2020-05-09 15:31:28
 * @Description: 请输入
 */
module.exports = {
  outputDir: process.env.outputDir,
  runtimeCompiler: true,
  devServer: {
    //port: 42380, // 端口号
    port: 8089,
    proxy: {
      '/WebApi': {
        target: "http://jhcdms.f3322.net:81",
        // target: 'http://jhcdms.f3322.net:8099',
        // target: "http://192.168.10.200:81",
        // target: 'http://106.75.71.90',
        // target:'http://localhost',
        //target: 'http://192.168.110.1',
        // target: 'http://i3vmsweb.i3vgroup.cn',
        // target: "http://jhcdms.f3322.net:8090",
        // target: "http://jhcdms.f3322.net:8098",
        // target: "http://localhost:80",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/WebApi': 'WebApi', //重写,
        }
      },
      // // 引用bos3d预览时需要
      // "/Bos3d": {
      //   target: "http://bos3d.bimwinner.com",
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/Bos3d": "Bos3d"
      //   }
      // },
      // "/bos": {
      //   target: 'http://139.9.215.236:8080',
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/bos": ''
      //   }
      // },
      '/BMP': {
        target: "http://jhcdms.f3322.net:81",
        // target: "http://192.168.10.200:81",
        // target: 'http://106.75.71.90',
        //target: 'http://192.168.110.1',
        //target:'http://localhost',
        // target: "http://jhcdms.f3322.net:8090",
        // target: 'http://i3vmsweb.i3vgroup.cn',
        // target: "http://jhcdms.f3322.net:8098",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/BMP': 'BMP', //重写,
        }
      },
    }
  },
  /**
   * @see https://cli.vuejs.org/zh/config/#publicpath
   */
  publicPath: './'
}

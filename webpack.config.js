const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  context: process.cwd(), //上下文: 当前目录
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'monitor.js'
  },
  devServer: {
    // 在新版的webpack-dev-server中，contentBase已经被移除了，用static替代。
    //contentBase: path.resolve(__dirname, 'dist')
    // static: path.resolve(__dirname, 'dist'),
    allowedHosts: 'auto',
    // before(router){ //用来配置路由
    //   router.get('/success', function(req, res){
    //     res.json({ id: 1}) //200
    //   })
    //   router.post('/error', function(req, res){
    //     res.sendStatus(500)
    //   })
    // }
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head' //注入到哪？index.html文件的<head>
    })
  ]
}

//安装模块：npm i webpack webpack-cli html-webpack-plugin user-agent webpack-dev-server -D
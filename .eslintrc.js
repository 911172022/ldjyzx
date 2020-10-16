module.exports = {
  //此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  //此项指定环境的全局变量，下面的配置指定为浏览器环境
  // browser - 浏览器环境中的全局变量。
  // node - Node.js 全局变量和 Node.js 作用域。
  env: {
    node: true,
    browser: true,
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    parser: 'babel-eslint'
  },
  // add your custom rules here
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  //"error" -> 2 开启错误规则
  // 了解了上面这些，下面这些代码相信也看的明白了
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-empty': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn' // Disallow registering components that are not used inside templates
  },
}

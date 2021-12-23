# 简答题

#### 1.简述前端兼容性的解决方案及不同工具的使用（CSS及JS）

##### CSS兼容性解决方案

###### webpack + postcss和其插件
使用:
> 注意使用.browserslistrc配置兼容的浏览器平台

```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
			'style-loader', // style-loader 会生成一个style标签, 把对应的css添加进来
			{
				loader: 'css-loader', // // @import 和 url() 进行处理，就像 js 解析 import/require() 一样。但是不能把样式放到界面上使用
				options: {
					importLoaders: 1, // 碰到引入的css文件, 再次从上一个loader处理下, 这里是postcss-loader
					esModule: false // 不转成esModule
				}
			},
			'postcss-loader'
		],
      }
    ]
  }
}
```
```
// postcss.config.js
module.exports = {
	plugins:[
		require('postcss-preset-env') // 使用插件集合
	]
}
```
###### gulp + postcss和其插件
```
// gulpfile.js
const gulp = require('gulp')
gulp.task('css', () => {
  const postcss    = require('gulp-postcss')
  const sourcemaps = require('gulp-sourcemaps')

  return gulp.src('src/**/*.css')
    .pipe( sourcemaps.init() )
    .pipe( postcss([ require('postcss-preset-env')]) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('build/') )
})
```

##### javascript兼容性解决方案
###### webpack + babel
使用:
> 注意使用.browserslistrc配置兼容的浏览器平台
```
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
		test: /\.js$/,
		use: {
			loader: 'babel-loader'
		}
	  }
    ]
  }
}
```
```
// babel.config.js
module.exports = {
	presets: [
		['@babel/preset-env'], // 用于编译ES2015+语法的插件集合
		{
			useBuiltIns: 'entry', // 根据当前配置的兼容浏览器去填充
			corejs: 3 // 默认版本是2, 看你安装的版本
		}
	]
}
```
```
// 入口文件main.js
import "core-js/stable";
import "regenerator-runtime";
```
###### gulp + babel

```
// gulpfile.js
const gulp = require('gulp')
const babel = require('gulp-babel');

gulp.task('js', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
		presets: [
			['@babel/preset-env'],
			{
				useBuiltIns: 'entry', // 根据当前配置的兼容浏览器去填充
				corejs: 3 // 默认版本是2, 看你安装的版本
			}
	}))
    .pipe( gulp.dest('build/') )
})
```
```
// 入口文件main.js
import "core-js/stable";
import "regenerator-runtime";
```




#### 2.列举三种常见的webpack打包优化手段及使用步骤

1. 预加载和预获取模块
   ```
   import(/* webpackPrefetch: true */ './src/maybe.js'); // 预获取：将来某些导航下可能需要的资源
   import(/* webpackPreload: true */ './src/current.js'); // 预加载：当前导航下可能需要资源
   ```
2. 第三方扩展CDN 
  ```
  module.exports = {
    // ...
    externals: { // 外部扩展
	 	  lodash: '_' // lodash 不打包到dist, 别名是_
	  },
  }
  ```
3. CSS抽离和压缩
  ```
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  module.exports = {
    module: { // 放置模块的匹配规则等
      rules: [
        {
          test: /\.css$/,// 一般是一个正则表达式, 用来匹配文件类型
          // style-loader 会生成一个style标签, 把对应的css添加进来
          use: [
            MiniCssExtractPlugin.loader, 
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1, // 碰到引入的css文件, 再次从上一个loader处理下, 这里是postcss-loader
                esModule: false // 不转成esModule

              }
            },
            'postcss-loader'
          ] // loader 从右往左运行
        },
      ]
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin({
            filename: '[name].[hash:8].css'
          }), 
        ],
    },
  }

  ```
4. js压缩
  ```
  const TerserPlugin = require("terser-webpack-plugin");
  module.exports = {
    optimization: {
        minimizer: [
          new TerserPlugin()
        ],
    }
  }

  ```



#### 作业要求

答案写在当前文件中, 保存后提交到作业仓库即可

// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
plugins.sass = require('gulp-sass')
plugins.babel = require('gulp-babel')
plugins.swig = require('gulp-swig')
plugins.imagemin = require('gulp-imagemin')
plugins.del = require('del')

const browserSync = require('browser-sync')
const bs = browserSync.create()

const cwd = process.cwd()
let config = {
	build: {
		src: 'src',
		dist: 'dist',
		temp: 'temp',
		public: 'public',
		paths: {
			styles: 'assets/styles/*.scss',
			scripts: 'assets/scripts/*.js',
			pages: '*.html',
			image: 'assets/images/**',
			fonts: 'assets/fonts/**',
			public: 'public/**'
		}
	}
}
try {
	const loadConfig = require(`${cwd}/pages.config.js`)
	config = Object.assign({}, config, loadConfig)
} catch(e){

}

const clean = () => {
  return plugins.del([config.build.dist, config.build.temp])
}
const style = () => {
  return src(config.build.paths.styles, {
    base: config.build.src,
	cwd: config.build.src,
  })
    .pipe(plugins.sass({
      outputStyle: 'expanded' // 花括号完全展开
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true})) // 把更新的文件推到浏览器
}
const script = () => {
  return src(config.build.paths.scripts, {
    base: config.build.src,
	cwd: config.build.src,
  })
    .pipe(plugins.babel({ // babel只是一个平台
      presets: [require('@babel/preset-env')] // 这是babel的插件集合
    }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true}))
}
const page = () => {
  return src(config.build.paths.pages, {
    base: config.build.src,
	cwd: config.build.src,
  })
  .pipe(plugins.swig())
  .pipe(dest(config.build.temp))
  .pipe(bs.reload({ stream: true}))
}
const image = () => {
  return src(config.build.paths.image, {
    base: config.build.src,
	cwd: config.build.src,
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}
const font = () => {
  return src(config.build.paths.fonts, {
    base: config.build.src,
	cwd: config.build.src,
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}
const extra = () => {
  return src(config.build.paths.public, {
    base: config.build.public,
	cwd: config.build.public,
  })
  .pipe(dest(config.build.dist))
}

const serve = () =>{
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts,  { cwd: config.build.src },script)
  watch(config.build.paths.pages, { cwd: config.build.src },  page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  // 重新更新浏览器
  watch([config.build.paths.image, config.build.paths.fonts], { cwd: config.build.src }, bs.reload)
  watch('**', { cwd: config.build.public },  bs.reload)

  bs.init({
    notify: false,
    port: 8080,
    // files: 'dist/**', //监听热更新文件
    server: {
      baseDir: [config.build.temp, config.build.src, config.build.public],
      open: true,
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  }) 
}
const useref = ()=>{
  return src(config.build.paths.pages, {
    base: config.build.temp,
	cwd: config.build.src
  })
  .pipe(plugins.useref({ searchPath: [config.build.temp, '.']})) // 合并node_modules引入的文件
  .pipe(plugins.if(/\.js$/, plugins.uglify()))
  .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/, plugins.htmlmin({
    collapseWhitespace: true, // 折叠空白
    minifyCss: true, // 让css更小
    minifyJS: true // 让js更小
  })))
  .pipe(dest(config.build.dist))
}


const compile = parallel(style, script, page)

// 上线之前执行的任务
const build = series(clean, parallel(series(compile, useref), image, font, extra))

const develop = series(compile, serve)
module.exports = {
  clean,
  build,
  develop
}
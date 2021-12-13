## 简答题

**1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。**

答:
  1. 降低开发成本, 让开发者更快上手
  2. 提高开发效率, 让开发者专注于自己负责的功能
  3. 统一管理开发项目, 能自上而下落实技术方案
　

**2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？**

答:
  1. 减少重复代码的开发
  2. 提高开发效率, 让开发者专注于业务
  3. 统一技术规范, 降低沟通成本和减少无效工作
　

　

## 编程题

**1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具**

需求: 
目前公司有H5类型、小程序类型、PC后台类型的项目, 需要使用脚手架下载并创建不同类型的项目, 接着创建gitlab项目,接着初始化git, 并把本地仓库推到远程仓库, 然后可下载项目依赖和运行项目
脚手架实现的过程:

1. 使用 commander在命令行使用命令操作脚手架
2. 使用 inquirer 实现在命令行的交互式操作
3. 使用 chalk 实现 命令行输出数据的颜色变化
4. 使用 ora 实现 命令行 提示信息的动态效果
5. 使用 typescript 做强类型的校验
6. 使用 webpack 做npm包源代码的打包

创建项目核心类的代码

```javascript
const inquirer = require('inquirer')
const Metalsmith = require('metalsmith')
const { render } = require('ejs')
const { handleCommand } = require('@/utils/terminal.ts')
const { addLoading, downloadRepo } = require('@/utils')
const { fetchTags, createProject, protectedBranches } = require('@/api')
// const inquire = require('./inquire')

const path = require('path')
const GROUP_ID = 339 //组id
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm'


class Create {
	public config: createConfig;
	protected destDir:string;
	protected tag: tagModel | null;
	protected tags: tagModel[];
	protected tagsForAsk: string[];
	protected inquire:any;
	protected inquireInfo:any;
	constructor(config:createConfig) {
		this.config = config;
		this.destDir = '' // 存储项目代码路径
		this.tag = null
		this.tags = []
		this.tagsForAsk = []
		this.inquireInfo = {}
		this.inquire = config.inquire
	}
	// 查询tag信息
	async getTags() {
		try {
			this.tags = await addLoading(fetchTags)(this.config.tmpId)
			this.tagsForAsk = this.tags.map((item:{name:string}) => item.name)
		} catch(err){
			console.log(err);
		}
	}
	// 下载项目
	async download() {
		try {
			this.destDir = await addLoading(downloadRepo, {
				start: '项目模版下载中...',
				end: '下载完成'
			})(this.config.tmpId, this.config.repoType, this.tag)
		} catch(err){
			console.log(err);
		}
	}
	// 进行询问
	async ask() {
		this.inquireInfo = await this.inquire({
			tags: this.tagsForAsk
		})
		this.tag = this.tags.find((item) => item.name === this.inquireInfo.tag) || null
	}
	// 写入本地
	async write () {		
		await addLoading(this.writeProject.bind(this), {
			start: '项目写入本地文件夹...',
			end: '写入完成'
		})(this.inquireInfo, this.destDir)
	}
	// 重新写入渲染文件
	async renderFile(content:Buffer) {
		await render(content, {
			projectName: this.inquireInfo.name,
			gitignore: ['node_modules', '.env.local', '.env.*.local'],
			description: this.inquireInfo.description,
		})
	}
	// 本地写入一个项目
	writeProject () {
		return new Promise((resolve, reject)=>{
			Metalsmith(process.cwd())
			.source(this.destDir)
			.destination(path.resolve(this.inquireInfo.name))
			.use((files: any, metal: any, done:any)=>{
				Reflect.ownKeys(files).forEach(async (fileName) => {
					// @ts-ignore
					if(!fileName.includes('index.html') && !fileName.includes('assets') && !fileName.includes('node_modules')) {
						try{
							let content = files[fileName].contents.toString()
							if(content.includes("<%")) {
								content = await this.renderFile(content)
								files[fileName].contents = Buffer.from(content)
							}
						} catch(e) {
							console.log(e);
							console.log(fileName, '<======');
						}
					}
				})
				done()
			})
			.build((err:any)=>{
				if(err){
					reject(err)
				} else {
					resolve(void(0))
				}
			})
		})
	}
	// 代码管理静态方法
    async manageCode () {
		// 创建gitlab远程项目
		const gitlabProject = await addLoading(createProject, {
			start: '创建gitlab远程项目',
			end: 'gitlab创建项目成功'
		})({
			name: this.inquireInfo.name,
			namespace_id: GROUP_ID,
			default_branch: 'master',
			description: this.inquireInfo.description
		})

		const commandGit = handleCommand('git', `./${this.inquireInfo.name}`)
		// git init
		await commandGit('init')
		// git remote add origin url
		await commandGit(`remote add origin ${gitlabProject.http_url_to_repo}`)
		// git add .
		await commandGit('add .')
		// git commit -m
		await commandGit('commit -m init')
		// git push -u origin master
		await commandGit('push -u origin master')
		// git checkout -b pre
		await commandGit('checkout -b pre')
		//  git push --set-upstream origin pre
		await commandGit('push --set-upstream origin pre')
		// git checkout -b test
		await commandGit('checkout -b test')
		//  git push --set-upstream origin test
		await commandGit('push --set-upstream origin test')
		// git checkout -b dev
		await commandGit('checkout -b dev')
		//  git push --set-upstream origin dev
		await commandGit('push --set-upstream origin dev')

		await addLoading(protectedBranches, {
			start: '远程分支保护中...',
			end: '设置成功'
		})({
			id: gitlabProject.id,
			name: 'pre',
		})
	}
	// 项目运行方法
	async runProject () {
		const commandNpm = handleCommand(NPM, `./${this.inquireInfo.name}`)

		await commandNpm('install')
		// npm run core
		await commandNpm('run core')
		// npm run serve
		await commandNpm('run serve')
	}
}
export{} // 解决无法重新声明块范围变量
module.exports = Create;
```

7. 


**2、尝试使用 Gulp 完成项目的自动化构建**  ( **[先要作的事情](https://gitee.com/lagoufed/fed-e-questions/blob/master/part2/%E4%B8%8B%E8%BD%BD%E5%8C%85%E6%98%AF%E5%87%BA%E9%94%99%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E5%BC%8F.md)** )

(html,css,等素材已经放到code/pages-boilerplate目录)

　

　

## 说明：

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 说明文档和代码统一提交至作业仓库。
# NodejsMysql

摸鱼购物网---MySQL数据库课程设计

## 这是数据库课设B/S架构的项目

首先祝贺这个项目成功转正，变成了课设项目本体<br/>
这次数据库选题是做一个**校园小商品交易系统**<br/>
~~主要是练习使用 `express` + `mysql` 配合,顺便试一下 `layui` 这个前端框架~~<br/>
~~希望我们能在课设周之前搞完(想多了)~~<br/>
课设完成了

## 主目录下各文件/文件夹功能

`api` 文件夹: 扩展功能模块存放的文件夹, 目前包含验证码、Token和文件上传模块<br/>
`bin` 文件夹: 此项目的启动配置( `npm` 启动就是从执行里面的 `www` 文件开始的)<br/>
`db` 文件夹: 存放数据库连接模块和配置<br/>
`pages` 文件夹: HTML页面存放处(前台不能通过路径访问)<br/>
`public` 文件夹: 前台能够访问到的文件夹，存放 `css`、浏览器引用的 `js` 、图片、字体等前端要用的文件<br/>
顺便上传的图片也在这里面的 `uploadimg` 文件夹里 ~~如果真上线是不是成了免费图床了~~<br/>
`routers`文件夹: 路由文件存放处, 保存了几乎整个项目的GET、POST请求处理的逻辑(`index.js`)<br/>
`views` 文件夹: `ejs` 模板文件存放处<br/>
`.gitattributes` 文件: github上，识别你的代码应该归为哪一类语言的配置文件，自动识别是根据各语言的代码量来决定是哪种语言的项目<br/>
`.gitignore` 文件: 不需要添加到版本管理中的文件排除配置<br/>
`app.js` 文件: 此 `Express.js` 后台的核心配置文件, 顺便由`npm` 启动的 `www` 文件是引用了 `app.js` 的<br/>
`ClearUploadCache.ps1` 文件: 清理未清除的上传图片缓存的 `PowerShell` 脚本<br/>
`daemon.ps1` 文件:  快速用 `pm2` 启动项目并进行进程守护自动打开日志显示的 `PowerShell` 脚本<br/>
`LICENSE` 文件: 开源协议文件 我这个项目的开源协议是 `MIT`<br/>
`package-lock.json` 文件: 锁定使用 `npm` 安装包时的版本号,确保别人部署时能够安装正确版本的包<br/>
`package.json` 文件: 创建了一个Node.js项目，意味着创建了一个模块，这个模块的描述文件，被称为package.json<br/>
`process.json` 文件: `pm2` 的启动配置(使用 `pm2 start process.json` 进程守护)<br/>
`README.md` 文件: 你正在看的这个说明文档 XD<br/>
`run.ps1` 文件: 快速启动项目的 `PowerShell` 脚本<br/>

## 注意

在此项目里,您可能会看/遇到：

* 冗长的写法
* 凌乱的逻辑
* 回调地狱
* 突然抛出异常
* 几乎所有页面的 `GET` 、`POST` 请求的处理都放在了 `./router/index.js`
* 改不完的bug
* 控制台老是有奇怪的输出
* 乱七八糟的注释
* `ejs` 模板页和静态页混用
* 前端网页上有好多功能没实现
* ······

如果有好的建议或着你有重构的想法欢迎在 `issues` 面板提出

## 特点

* 采用npm作为包管理工具
* 前端框架使用了[Layui](https://www.layui.com/),[Github项目页面](https://github.com/sentsin/layui/)
* 后端采用了[express](https://github.com/expressjs/express/),这是一个 `Node.js` 实现的后端框架,功能比较全面
* 与 `mysql` 交互使用了[mysql.js](https://github.com/mysqljs/mysql),这是一个纯js实现的能与`mysql`交互的客户端
* 各模块版本要求在package.json里
* 使用 [ejs](https://github.com/mde/ejs) 生成商品页面、通过在商品页面连接后添加 `?cid=` 来访问数据库获取商品信息
* 使用了 [nodemon](https://github.com/remy/nodemon) 做修改后自动编译的启动器
* 从网上找来的前端商城页面
* 使用了[x-admin](http://x.xuebingsi.com/)的后端管理模板(实际上基于layui，我们也对其进行了`ejs`魔改)
* ajax均采用jquery完成(layui已经包含了jquery模块)，超大量使用ajax注意
* 使用了 [multer](https://github.com/expressjs/multer) 配合 `layui` 处理上传文件
* 使用 [pm2](https://github.com/Unitech/pm2) 进行进程守护

## 登陆界面和注册界面（github上仅界面，无后台）

请点链接查看<br/>
[登陆](https://lollipopnougat.github.io/login-pages/login)<br/>
[注册](https://lollipopnougat.github.io/login-pages/register)<br/>
~~此部分最终会被重构~~<br/>
[后台登陆](https://lollipopnougat.github.io/login-pages/bslogin)<br/>

## 重构

~~看了一下db文件夹,觉得有必要重构一下数据库连接了,顺便得把之前测试的乱七八糟全撤掉,又是大修……~~<br/>
~~经过一番改动终于弃用了一个数据库连接的文件,现在正在逐步替换掉剩余部分~~
重构工作已经完成,所有数据库连接部分已经全部替换成 `./db/db.js`

## 怎么跨平台/机器部署

首先你要确认你的npm(6.9.0)版本、node(10.15.3以上)版本、mysql(8.0以上)的版本,然后 `git clone` 项目<br/>
然后 `cd nodejsmysql`到项目目录里输入 `npm i` 安装完依赖,然后执行 `npm start` 即可执启动后端服务<br/>
当然还可以通过`pm2` 进程保护启动,当前目录控制台输入 `pm2 start process.json` 即可使用 (常驻内存,进程崩溃会立刻重启,错误会写入日志)

## 页面

前台登陆页是 `/login`, 前台注册页是 `/register` , 前台主页是 `/home` , 登录后的主页是 `/homejs`(ejs模板页)<br/>
后台登录页是 `/bslogin` , 登录后的管理员主页是 `/bsindex`, 商家登录后台页面是 `/bswell`

## 截图

PC (1920 × 1080):
前台商城截图
![前台截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture4.jpg)
后台登陆界面
![后台登陆界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture1.jpg)
后台用户信息修改界面截图
![后台用户信息管理界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture3.jpg)
后台商品图片修改界面截图
![后台商品图片管理界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture2.jpg)
后台商品图片上传界面截图
![后台商品图片上传界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture13.jpg)
移动端 (仅在 2560 × 1440 下测试):
前台商城截图
![前台截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture6.jpg)
![前台截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture7.jpg)
后台登陆界面
![后台登陆界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture5.jpg)
后台管理员欢迎界面
![后台登欢迎界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture8.jpg)
后台商品信息管理登陆界面
![后台商品信息管理界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture9.jpg)
后台商家欢迎界面
![后台商家欢迎界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture12.jpg)
后台移动页面适配(自动收起此侧边)
![后台商家欢迎界面截图](https://lollipopnougat.github.io/website-calculator/img/fstack/screencapture11.jpg)

## 写在最后

从去年（2018）年底动手搭博客,到今年春节练习js正则,到开学学计组尝试写的求原反补码的页面,还有受网络安全社团人影响学习的`jquery` ,还有脑子一热去看了 `CoffeeScrpt` 甚至 `TypeScript`,一直到现在拿 `Node` 做全栈,深深体会到了**建站技术**的重要性。<br/><br/>
*网工人怎么能不会全栈开发！！！！！！！！*

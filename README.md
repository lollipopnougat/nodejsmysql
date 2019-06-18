# NodejsMysql

## 这是数据库课设B/S架构的项目

首先祝贺这个项目成功转正，变成了课设项目本体<br/>
这次数据库选题是做一个**校园小商品交易系统**<br/>
~~主要是练习使用`express`+`mysql`配合，顺便试一下`layui`这个前端框架~~<br/>
~~希望我们能在课设周之前搞完(想多了)~~<br/>

## 注意

在此项目里，您可能会看/遇到：

* 冗长的写法
* 凌乱的逻辑
* 回调地狱
* 突然抛出异常
* 改不完的bug
* 控制台老是有奇怪的输出
* 乱七八糟的注释
* `ejs`模板页和静态页混用
* ······

如果有好的建议或着你有重构的想法欢迎在 `issues` 面板提出

## 特点

* 采用npm作为包管理工具
* 前端框架使用了[Layui](https://www.layui.com/),[Github项目页面](https://github.com/sentsin/layui/)
* 后端采用了[express](https://github.com/expressjs/express/),这是一个`Node.js`实现的后端框架,功能比较全面
* 与 `mysql` 交互使用了[mysql.js](https://github.com/mysqljs/mysql),这是一个纯js实现的能与`mysql`交互的客户端
* 各模块版本要求在package.json里
* 使用 [ejs](https://github.com/mde/ejs) 生成商品页面、通过在商品页面连接后添加 `?cid=` 来访问数据库获取商品信息
* 使用了 [nodemon](https://github.com/remy/nodemon) 做修改后自动编译的启动器
* 从网上找来的前端商城页面
* 使用了[x-admin](http://x.xuebingsi.com/)的后端管理模板(实际上基于layui，我们也对其进行了`ejs`魔改)
* ajax均采用jquery完成(layui已经包含了jquery模块)，超大量使用ajax注意
* 使用了 [multer](https://github.com/expressjs/multer) 配合 `layui` 处理上传文件
* 使用 [pm2](https://github.com/Unitech/pm2) 进行进程守护

## ~~登陆界面和注册界面（github上仅界面，无后台）~~

~~请点链接查看~~<br/>
~~[登陆](https://lollipopnougat.github.io/login-pages/login)~~<br/>
~~[注册](https://lollipopnougat.github.io/login-pages/register)~~<br/>
此部分最终会被重构

## 重构

~~看了一下db文件夹，觉得有必要重构一下数据库连接了，顺便得把之前测试的乱七八糟全撤掉，又是大修……~~<br/>
经过一番改动终于弃用了一个数据库连接的文件，现在正在逐步替换掉剩余部分


## 怎么跨平台/机器部署

首先你要确认你的npm(6.9.0)版本、node(10.15.3以上)版本、mysql(8.0以上)的版本，然后`git clone` 项目<br/>
然后 `cd nodejsmysql`到项目目录里输入 `npm i` 然后运行 `npm start` 即可执行<br/>
当然还可以不输入 `npm start` ，输入 `pm2 start dev` 即可使用 `pm2` 进行进程保护(常驻内存，进程崩溃会立刻重启)

## 写在最后

从去年（2018）年底动手搭博客，到今年春节练习js正则，到开学学计组尝试写的求原反补码的页面，还有受网络安全社团人影响学习的`jquery`，还有脑子一热去看了`CoffeeScrpt`甚至`TypeScript`，一直到现在拿`Node`做全栈，深深体会到了**建站技术**的重要性。<br/><br/>
*网工人怎么能不会全栈开发！！！！！！！！*

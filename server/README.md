# server
[灵犀木的博客](http://www.lingximu.com)的服务端代码

## Quick Start

> 生产环境使用 pm2 进行进程守护

> 开发环境使用 vscode 作为开发&调剂工具

```shell
## 初始化项目
git clone git@github.com:lingximu/server.git
cd server
npm install
## 初始化配置
vim .env # 初始化环境变量，根据 .env.trace 填写
vim ./config/local.js # 初始化私人配置文件,需覆盖 config/default 中的 undefined 选项
vim ./config/default.js # 修改其中的 staticRootDir 为要静态代理的文件夹
## 生产环境启动项目
npm install -g pm2
pm2 start app.config.js
## 开发环境调试项目
## vscode 下按 F5 开始调试
```

## Introduce

> - 利用 dotenv 和 config 管理不同环境下的配置

> - 对 private 路径开头的，需输入配置中的 private_name 和 private_pass 才能访问

> - 增加了缓存( 时间为 1000 * 60 * 60 * 1 ms )；配置了 etag 和条件请求判断，提高资源利用率

# docker/docker-compose/docker-mechine overview

### docker概念

> [下载docker](https://docs.docker.com/docker-for-mac/install/)

![architecture](http://snappyimages.nextwavesrl.netdna-cdn.com/img/6cf5bd9aedef9503c6d27f9c80856afd.png)

![Container Layer](http://snappyimages.nextwavesrl.netdna-cdn.com/img/6685dfd6049b600a3bf88211b93115f5.png)

### 制作的过程及使用方法

- 用commit的方法

  ```shell
  docker run -it node:8 bash
  - npm install -g nodemon
  # docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
  docker commit 52c573ed38ce t2/commit
  docker run -it t2/commit bash
  ```


> 用这种命令制作的镜像，在各个环境表现都是一样的，不会有环境的差异。

- 用`Dockerfile`制作镜像

  ```dockerfile
  FROM node:8
  RUN npm install -g nodemon
  RUN mkdir -p /home/project
  COPY . /home/project
  ```

  ```shell
  # 编译命令
  docker build -t t2/mk1 .
  ```

  > 一般用这种方式构建，原因如下：
  >
  > 1，第一种构建的镜像不能重用
  >
  > 2，第一种方式构建的镜像过程不透明，只能一层一层叠加，到最后可能使用者都忘记了这个镜像里面都有什么软件、什么环境，没法重新布置一套新的
  >
  > > 查看镜像历史`docker history t2/commit`

### 使用场景

#### 1，开发环境使用

> - 本地文件变动频繁——volum概念
>
> - 将容器的端口暴露出来
>
>   > expose只是声明，不会直接打开该端口

![Data Volume](http://snappyimages.nextwavesrl.netdna-cdn.com/img/3fcfab52db8202a060202053ebad06de.png)

新的Dockerfile文件

```Dockerfile
FROM node:8

RUN mkdir -p /home/project
RUN npm install -g nodemon
VOLUME [ "/home/project" ]

WORKDIR /home/project/server
EXPOSE 8000
ENTRYPOINT nodemon cli.js app
```

docker启动命令

```shell
docker run   -it   --rm  -v $(pwd):/home/project  -p 8003:8000  t1/dev7  bash
```

简化——编写shell文件   `./dev.sh`

```shell
# /bin/sh
docker run \
    -it \
    --rm \
    -v $(pwd):/home/project \
    -p 8003:8000 \
    t1/dev7 \
    bash
```

再简化——编写`docker-compose.yml`文件

```yaml
version: "2"
services:
  node1:
    build: ./
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/home/project
    ports:
      - "8002:8000"
    command: "node cli.js app"
```

> 启动 `docker-compose up `
>
> 删除`docker-compose down`

再进一步 ——  启动多个服务； 将一个服务重复启动十次

- 启动两个node服务  ps：两个services的名字必须不一样

```yaml
version: "2"
services:
  node1:
    build: ./
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/home/project
    ports:
      - "8002:8000"
    command: "node cli.js app"
  node2:
    build: ./
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/home/project
    ports:
      - "8004:8000"
    command: "node cli.js app"
```

- 将一个服务启动十个 `docker-compose up --scale node1=10 `

  > 以Nginx作为负载均衡；可以随时实现服务扩容
  >
  > > 局限：在一台机器上
  >
  > > 解决：用swarm和k8s实现在多台机器上扩容，建立一个服务器集群

#### 2，生产环境使用

> - 将项目文件打包进去
> - 将日志文件暴露出来
> - 用pm2作为进程守护 —— 换成 [pm2-docker image](https://github.com/keymetrics/docker-pm2)

生产环境镜像如下 `Dockerfile2`

```dockerfile
FROM keymetrics/pm2:8-alpine

RUN mkdir -p /home/project
COPY . /home/project

ENV NODE_ENV=production

EXPOSE 8000
VOLUME [ "/home/project/logs" ]
WORKDIR /home/project/server

ENTRYPOINT [ "pm2-runtime", "start", "apps.json"]
```

> 编译镜像 `docker build -t t2/pro -f Dockerfile2 .`

> 启动容器
>
> > 用脚本启动
> > 增加了-d——后台运行
> > 去掉了-it和bash
> ```shell
> # /bin/sh
> docker run \
>     -d \
>     -v $(pwd)/logs:/home/project/server/logs \
>     -p 8003:8000 \
>     t2/pro
> ```
>
> > 注意日志文件：日志已经输出到挂载的volume上

常用命令

```shell
## 查看环境变量
docker run --rm kps/base env
## 后台容器
docker run -d --name demo3 demo/2
## 查看日志
docker logs demo3
## 交互式启动
docker run -it --name demo-2 demo/2 bash
## 启动
docker run -d -v $(pwd):/home/project/logs/ -p 8001:8000 89c2c1bb4037
## 进入内部看日志
docker exec -it 78b3ec7240a1e7dc0ffe6aee5b1c8b0bf1e215fc84f01609771a9408297d89af /bin/sh
```

## 彩蛋：docker-machine

> [Docker Machine 是什么 ](https://www.cnblogs.com/sparkdev/p/7044950.html)

```shell
##本地
docker-machine create demo
# 查看环境变量
docker-machine env demo
# 连接远程host 即输入上个命令输出的内容
eval $(docker-machine env demo)
# 连接远程服务器
docker-machine create -d generic \
    --generic-ip-address=xxx.xxx.xx.xx \
    --generic-ssh-user=user \
    --generic-ssh-key ~/.ssh/id_rsa \
    demo

docker-machine ls

```

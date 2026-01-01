---
title: Docker项目部署实录 ——从零到上线的魔法旅程
published: 2025-08-14
description: '#Docker项目部署实录'
tags: [NAS,Docker,教程]
category: '教程'
draft: false
lang: ''
---

----

`# Docker项目部署实录 ——从零到上线的魔法旅程`

> “Docker是啥？简单说，就是让项目**随身带环境**，跑哪都能活。”  
> ——一个被`docker ps`和`docker logs`治愈过的人（笑

----
## 1 手动部署

这部分就是——一步一个脚印，从零开始用 Docker 把项目干到线上。  

虽然有点繁琐，但好处是**你会清楚地知道每个命令是干嘛的**，不至于成天靠 CV（？）。

----

### 1.1 创建网络

为什么第一步是建网络？因为多个容器（MySQL、后端、前端）之间要互通，你总不能一个个找 IP，像早年QQ加好友那样麻烦。

`bash`

# 创建网络（名字随便起，我这里叫project）

docker network create project

# 查看现有网络

docker network ls

**注意**：后面所有部署的容器，都要用这个网络，这样它们之间就能直接用**容器名**互相访问（高级点就是 DNS 解析），不需要记IP。

----

### 1.2 MySQL 的部署

#### 1.2.1 准备工作

先在 `/root` 目录下整一个 `mysql` 文件夹，然后在里面建好三个子文件夹：

`data/  -> 数据目录`

conf/  -\> 配置文件

init/  -\> 初始化脚本

**挂载逻辑**：主机和容器这三个目录会互相映射，这样容器里的数据、配置、初始化脚本都能被持久化保存。

**配置文件例子**（`conf/my.cnf`）：

`[client]`

default*character*set=utf8mb4

[mysql]

default*character*set=utf8mb4

[mysqld]

character*set*server=utf8mb4

collation*server=utf8mb4*unicode*ci*

init*connect='SET NAMES utf8mb4'*

作用：全局 UTF-8，防止“我明明写的是‘哈喽’，结果查出来一堆问号”。

**初始化 SQL 脚本例子**（`init/init.sql`）：

`DROP DATABASE IF EXISTS `hmall`;`

CREATE DATABASE IF NOT EXISTS `hmall`;

USE `hmall`;

CREATE TABLE IF NOT EXISTS `address` (

  id INT PRIMARY KEY AUTO*INCREMENT,*

  user*id INT NOT NULL,*

  detail VARCHAR(255)

);

作用：第一次启动就自动建库+建表，数据会直接进 `data/`。

----

#### 1.2.2 部署 MySQL 容器

`docker run -d \`

  --name mysql 

  -p 3306:3306 

  -e TZ=Asia/Shanghai 

  -e MYSQL*ROOT*PASSWORD=123 

  -v /root/mysql/data:/var/lib/mysql 

  -v /root/mysql/conf:/etc/mysql/conf.d 

  -v /root/mysql/init:/docker-entrypoint-initdb.d 

  --network project 

  mysql

**命令解构**：

- `-d`：后台跑，不挡你终端

- `--name mysql`：给容器取个好记的名字

- `-p 3306:3306`：把宿主机 3306 暴露出来

- `-e MYSQL_ROOT_PASSWORD=123`：root 密码

- `-v` 三连挂载：数据、配置、初始化

- `--network project`：加到刚才的网络里

跑完后去 `data/` 里看，应该已经有数据库文件了，init.sql也执行过了。

----

### 1.3 Java项目部署

#### 1.3.1 准备工作

##### 1.3.1.1 打包成 Jar

Maven 项目的话：

`<plugin>`

  \<groupId\>org.apache.maven.plugins\</groupId\>

  \<artifactId\>maven-compiler-plugin\</artifactId\>

  \<version\>3.8.1\</version\>

  \<configuration\>

    \<source\>11\</source\>
    
    \<target\>11\</target\>

  \</configuration\>

\</plugin\>

打包：

`mvn clean package`

然后在 `target/` 找到 `.jar`。

##### 1.3.1.2 编写 Dockerfile

`FROM openjdk:11.0-jre-buster`

ENV TZ=Asia/Shanghai

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ \> /etc/timezone

COPY hm-service.jar /app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]

----

#### 1.3.2 部署

##### 1.3.2.1 同目录放 jar 和 Dockerfile

比如 `/root/hmall/` 里：

`hm-service.jar`

Dockerfile

##### 1.3.2.2 构建镜像

`docker build -t hmall .`

##### 1.3.2.3 运行容器

`docker run -d --name hmall --network project -p 8080:8080 hmall`

----

### 1.4 前端项目部署

#### 1.4.1 准备挂载文件

创建 `/root/nginx/`，里面放：

`html/       -> 前端打包文件`

nginx.conf  -\> 自定义配置

**nginx.conf 核心**：

- 监听端口

- 静态资源路径 `/usr/share/nginx/html`

- 接口代理 `proxy_pass `[http://hmall:8080\`](http://hmall:8080`)

----

#### 1.4.2 部署 Nginx

`docker run -d \`

  --name nginx 

  -p 18080:18080 

  -p 18081:18081 

  -v /root/nginx/html:/usr/share/nginx/html 

  -v /root/nginx/nginx.conf:/etc/nginx/nginx.conf 

  --network project 

  nginx

----

### 1.5 测试

#### 1.5.1 查宿主机 IP

`ifconfig   # 如果没有，yum install net-tools -y`

#### 1.5.2 浏览器访问

``[http://宿主机IP:18080\`](http://宿主机IP:18080`)

看到页面就说明你的手动部署完美收官 🎉。

----

## 2 Docker Compose 自动化部署（章鱼哥版）

如果白雪版是一步步堆积木，那章鱼哥版就是直接掏出**乐高说明书**，一键拼好。

----

### 2.1 从 `docker run` 到 `docker-compose`

举个例子，把 MySQL 的长命令改成 docker-compose：

`version: "3.8"`

services:

  mysql:

    image: mysql
    
    container*name: mysql*
    
    ports:
    
                        - "3306:3306"
    
    environment:
    
      TZ: Asia/Shanghai
    
      MYSQL*ROOT*PASSWORD: 123
    
    volumes:
    
                        - "./mysql/conf:/etc/mysql/conf.d"
                        - "./mysql/data:/var/lib/mysql"
                        - "./mysql/init:/docker-entrypoint-initdb.d"
    
    networks:
    
                        - project

networks:

  project:

    external: true

----

### 2.2 常用命令

`docker compose up -d    # 后台启动`

docker compose down     # 停止并移除

docker compose ps       # 查看容器状态

docker compose logs     # 看日志

----

### 2.3 部署项目

#### 2.3.1 docker-compose.yml

把 MySQL + 后端 + Nginx 都写进去：

`version: "3.8"`

services:

  mysql:

    image: mysql
    
    container*name: mysql*
    
    ports:
    
                        - "3306:3306"
    
    environment:
    
      TZ: Asia/Shanghai
    
      MYSQL*ROOT*PASSWORD: 123
    
    volumes:
    
                        - "./mysql/conf:/etc/mysql/conf.d"
                        - "./mysql/data:/var/lib/mysql"
                        - "./mysql/init:/docker-entrypoint-initdb.d"
    
    networks:
    
                        - hm-net

  hmall:

    build:
    
      context: .
    
      dockerfile: Dockerfile
    
    container*name: hmall*
    
    ports:
    
                        - "8080:8080"
    
    networks:
    
                        - hm-net
    
    depends*on:*
    
                        - mysql

  nginx:

    image: nginx
    
    container*name: nginx*
    
    ports:
    
                        - "18080:18080"
                        - "18081:18081"
    
    volumes:
    
                        - "./nginx/nginx.conf:/etc/nginx/nginx.conf"
                        - "./nginx/html:/usr/share/nginx/html"
    
    networks:
    
                        - hm-net
    
    depends*on:*
    
                        - hmall

networks:

  hm-net:

    name: project

----

#### 2.3.2 一键部署

把 jar 包、Dockerfile、mysql 文件夹、nginx 文件夹 和 docker-compose.yml 全放到同一个目录，然后：

`docker compose up -d`

三连启动，MySQL ➡ 后端 ➡ 前端，直接上线。

----

## 总结

> “运维的尽头是 compose，compose 的尽头是 CI/CD。”

——来自一个已经被 Jenkins 和 GitHub Actions 摁在地上摩擦的朋友（笑）

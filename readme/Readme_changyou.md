

## 本地系统中运行（本地安装NodeJS环境）

除了Docker环境运行，还可以在系统中直接安装NodeJS环境运行。若要在系统中安装Nodejs，推荐使用nvm进行安装，NVM（Node version manager）是nodejs的专用版本管理器，可以快速方便地安装并切换nodejs的版本，方便以后升级NodeJS环境。

关于NodeJs环境的警告
如果服务器版本不兼容最新版本的nodejs，运行时出现如下错误，需要尝试升级系统的模块组件（危险操作），或尝试用上面推荐的Docker方案。

```
⚠️ 运行nodejs命令时出现如下相关错误：
npm install -g yarn

node: /lib64/libstdc++.so.6: version GLIBCXX_3.4.21' not found (required by node) node: /lib64/libstdc++.so.6: version 
```

#### 安装NVM与NodeJS步骤：

1. 使用git下载nvm源代码

```
# 用git从github下载nvm源码。
git clone https://github.com/cnpm/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```

```
❓若您的服务器 因为网络限制 无法访问github，可使用国内的gitee下载nvm源码：

git clone https://gitee.com/koalakit/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```

2. 使用nvm安装Nodejs

```
# 1. 将nvm设置为系统环境变量
echo "source ~/.nvm/nvm.sh" >> ~/.bashrc

# 2. 更新变量环境
source ~/.bashrc

# 3. 安装 nodejs ， 这里举例使用v16.14.0版本，其它更新的版本也可以用
nvm install v16.14.0
```

```
💡题外话：
用 nvm list-remote 命令可查看所有可安装的nodejs版本
用 nvm ls可查看所有已安装到本地的nodejs 版本
```

3. 安装yarn环境

NodeJS 自带了 NPM（Node Package Manager），他可以用来安装打包编译NotionNext这类基于Webpack打包的项目。不过npm不太好用，这里安装一个npm升级版yarn。

```
# 1.【可选步骤】 NPM切换国内淘宝网镜像，便于加速安装。
npm config set registry http://registry.npm.taobao.org

# 2. npm 全局安装 yarn 
npm install -g yarn
```

#### NodeJs运行NotionNext

1. 安装NotionNext依赖

```
# 执行以下命令，使用yarn安装项目所有依赖的脚本和库
yarn 
```
如果你没有安装yarn，也可以用 npm install 命令进行安装依赖。

2. 项目编译

每次修改代码，包括修改blog.config.js文件的内容后，都需要重新执行这步骤。

```
# 2.打包编译
yarn build

# 3.将你的notion_page_id设为环境变量，例如：
NOAGE_ID=29d5ia78b858e4a3bbc13e51b5400fb82
```

3. 启动项目

```
# 执行命令启动
yarn start
```




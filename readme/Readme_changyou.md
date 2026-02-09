
# 二次开发备忘录

## 一、本地系统中运行（本地安装NodeJS环境）

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

## 二、`NOTION_PAGE_ID` 的配置位置建议：

### 1)、推荐配置方式

#### 1. 本地开发环境（推荐）
使用 `.env.local`（已加入 `.gitignore`）

```bash
# 在项目根目录创建 .env.local 文件
NOTION_PAGE_ID=your-actual-notion-page-id
```

优点：
- 不会被 Git 追踪
- 优先级高于 `.env`
- 适合本地开发

#### 2. 生产环境（Vercel）
在 Vercel 项目设置中配置环境变量：
- Settings → Environment Variables
- 添加 `NOTION_PAGE_ID`

优点：
- 不进入代码仓库
- 支持不同环境（Production/Preview/Development）
- 便于团队协作

#### 3. Docker 部署
使用 Docker 构建参数或运行时环境变量：

```dockerfile
# Dockerfile 中已支持
ARG NOTION_PAGE_ID
ENV NOTION_PAGE_ID=${NOTION_PAGE_ID}
```

运行时：
```bash
docker run -e NOTION_PAGE_ID=your-id ...
```

### 注意事项

1. 不要放在 `.env` 中
   - 虽然已加入 `.gitignore`，但 `.env.local` 更安全
   - `.env` 可能被意外提交

2. 不要硬编码在代码中
   - 当前 `blog.config.js` 的默认值是空字符串，这是正确的

3. 不要提交到 Git
   - `.env.local` 已在 `.gitignore` 中
   - `.env.example` 只放占位符

### 当前状态检查

你的配置是正确的：
- `.env.example` 使用占位符 `your-notion-page-id`
- `.gitignore` 已排除 `.env.local`
- `blog.config.js` 从环境变量读取，默认值为空字符串

只需在本地创建 `.env.local` 并填入你的真实 `NOTION_PAGE_ID` 即可。


## 2)、process.env.NOTION_PAGE_ID 配置说明

`process.env.NOTION_PAGE_ID` 的读取来源：

### Next.js 环境变量加载机制

Next.js 会在启动时自动从以下文件加载环境变量（按优先级从高到低）：

#### 1. 本地开发环境（`next dev`）
```
.env.local          ← 最高优先级（记得加入 .gitignore）
.env.development.local
.env.development
.env.local
.env
```

#### 2. 生产环境（`next build` / `next start`）
```
.env.local
.env.production.local
.env.production
.env.local
.env
```

#### 3. 系统环境变量
- 操作系统环境变量
- Vercel 环境变量（部署时）
- Docker 环境变量（容器运行时）


读取流程：
1. Next.js 启动时读取 `.env.local`
2. 将 `NOTION_PAGE_ID` 注入到 `process.env`
3. `blog.config.js` 执行时读取 `process.env.NOTION_PAGE_ID`

### 重要说明

`NOTION_PAGE_ID` 没有 `NEXT_PUBLIC_` 前缀，因此：
- 仅在服务端可用（Node.js 环境）
- 不会暴露到浏览器端
- 在 `getStaticProps`、`getServerSideProps`、API 路由中可用
- 在客户端组件中不可用

## 验证方式

可以在代码中打印验证：

```javascript
// 在 blog.config.js 或任何服务端代码中
console.log('NOTION_PAGE_ID:', process.env.NOTION_PAGE_ID)
```

或者在 `next.config.js` 中：
```javascript
console.log('Env check:', {
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID,
  NODE_ENV: process.env.NODE_ENV
})
```

### 总结

`process.env.NOTION_PAGE_ID` 的数据来源：
1. 本地开发：`.env.local` 文件（当前已配置）
2. 生产环境：Vercel 环境变量或服务器环境变量
3. 默认值：如果都不存在，`blog.config.js` 中的 `|| ''` 会返回空字符串

当前配置正确，`.env.local` 中的值会被自动读取。

`changyou注`：
.env.local 不要提交到 git，注意敏感信息保护，NOTION_PAGE_ID也是敏感信息！


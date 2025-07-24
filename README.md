# 简单博客网站

一个基于静态文件的简单博客系统，支持 Markdown 文章自动展示。

## 功能特点

- 📝 支持 Markdown 格式文章
- 🚀 自动读取 posts 文件夹中的 .md 文件
- 📱 响应式设计，支持移动端
- 🎨 现代化 UI 设计
- 🔍 文章搜索功能
- 📄 个人介绍页面
- 🔗 友情链接页面

## 使用方法

### 1. 添加文章
1. 在 `posts` 文件夹中创建 `.md` 文件
2. 使用 Markdown 语法编写文章
3. 文件名建议使用英文和连字符，如：`my-first-post.md`

### 2. 文章格式
```markdown
# 文章标题

文章内容...

## 二级标题

更多内容...
```

### 3. 部署到 Git
1. 将整个项目推送到 Git 仓库
2. 使用 GitHub Pages、Netlify 或其他静态网站托管服务
3. 每次添加新文章后，只需 git push 即可

### 4. 自定义配置

#### 修改个人信息
编辑 `index.html` 中的关于我页面部分：
- 头像链接
- 个人介绍
- 社交链接

#### 修改友情链接
编辑 `index.html` 中的友链页面部分，添加你的友情链接。

#### 修改网站标题
在 `index.html` 中修改 `<title>` 标签和导航栏中的网站名称。

## 文件结构

```
bokeo/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript 功能
├── posts/              # 文章文件夹
│   ├── sample-article-1.md
│   ├── sample-article-2.md
│   └── sample-article-3.md
└── README.md           # 说明文档
```

## 技术栈

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Marked.js (Markdown 解析)
- Prism.js (代码高亮)

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 本地开发

1. 克隆或下载项目
2. 使用本地服务器打开 `index.html`
3. 推荐使用 VS Code 的 Live Server 插件

## 部署建议

### GitHub Pages
1. 将项目推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源

### Netlify
1. 将项目推送到 Git 仓库
2. 在 Netlify 中连接仓库
3. 设置构建命令为空（静态网站）

### 自定义域名
在托管服务中配置自定义域名，让你的博客拥有专属网址。

## 注意事项

1. 由于浏览器安全限制，本地直接打开 HTML 文件可能无法正常加载文章
2. 建议使用本地服务器进行开发和测试
3. 文章文件名不要包含中文字符
4. 图片建议使用外链或放在单独的 images 文件夹中

## 扩展功能

你可以根据需要添加以下功能：
- 文章分类和标签
- 评论系统（如 Gitalk）
- 访问统计（如 Google Analytics）
- RSS 订阅
- 全文搜索

## 许可证

MIT License - 可自由使用和修改。
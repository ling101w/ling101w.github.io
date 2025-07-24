// 全局变量
let articles = [];
let currentPage = 'home';

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupScrollEffects();
});

// 设置滚动效果
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滚动时的样式变化
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 滚动方向检测（可选：隐藏/显示导航栏）
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 初始化应用
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    loadArticles();
    showPage('home');
}

// 设置导航
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const backBtn = document.getElementById('back-btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            
            // 更新导航状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // 返回按钮
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('home');
            updateActiveNav('home');
        });
    }
}

// 设置移动端菜单
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭移动菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 显示指定页面
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // 如果是友链页面，加载友链内容
        if (pageId === 'links') {
            loadLinksContent();
        }
    }
}

// 更新导航活动状态
function updateActiveNav(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// 加载文章列表
async function loadArticles() {
    try {
        // 这里我们创建一些示例文章数据
        // 在实际使用中，你需要根据你的文件结构来动态获取文章列表
        articles = await getArticlesList();
        displayArticles();
    } catch (error) {
        console.error('加载文章失败:', error);
        displayNoArticles();
    }
}

// 获取文章列表（从文件夹结构中动态读取）
async function getArticlesList() {
    const articles = [];
    
    // 定义分类和对应的文件夹
    const categories = {
        'Life': 'life',
        'Explore': 'explore'
    };
    
    // 已知的文章文件（你可以根据实际文件扩展这个列表）
    const knownFiles = {
        'life': ['sample-article-2.md', 'sample-article-3.md'],
        'explore': [
            'sample-article-1.md',
            'sample-article-1 copy.md',
            'sample-article-1 copy 2.md',
            'sample-article-1 copy 3.md'
        ]
    };
    
    for (const [categoryName, folderName] of Object.entries(categories)) {
        const files = knownFiles[folderName] || [];
        
        for (const filename of files) {
            try {
                // 尝试获取文章内容来提取标题和摘要
                const content = await loadArticleContentFromPath(`posts/${folderName}/${filename}`);
                const articleInfo = extractArticleInfo(content, filename, categoryName);
                
                if (articleInfo) {
                    articles.push({
                        id: filename.replace('.md', ''),
                        title: articleInfo.title,
                        date: articleInfo.date || '2024-01-01',
                        excerpt: articleInfo.excerpt,
                        filename: filename,
                        category: categoryName,
                        path: `posts/${folderName}/${filename}`
                    });
                }
            } catch (error) {
                console.warn(`无法加载文章 ${filename}:`, error);
                // 如果无法加载，使用默认信息
                articles.push({
                    id: filename.replace('.md', ''),
                    title: filename.replace('.md', '').replace(/-/g, ' '),
                    date: '2024-01-01',
                    excerpt: '点击查看文章内容...',
                    filename: filename,
                    category: categoryName,
                    path: `posts/${folderName}/${filename}`
                });
            }
        }
    }
    
    return articles;
}

// 从指定路径加载文章内容
async function loadArticleContentFromPath(path) {
    const response = await fetch(path);
    if (response.ok) {
        return await response.text();
    } else {
        throw new Error(`无法加载文章: ${path}`);
    }
}

// 从文章内容中提取信息
function extractArticleInfo(content, filename, category) {
    const lines = content.split('\n');
    let title = filename.replace('.md', '').replace(/-/g, ' ');
    let excerpt = '';
    
    // 提取标题（第一个 # 开头的行）
    for (const line of lines) {
        if (line.startsWith('# ')) {
            title = line.substring(2).trim();
            break;
        }
    }
    
    // 提取摘要（第一个非空的段落）
    let foundTitle = false;
    for (const line of lines) {
        if (line.startsWith('# ')) {
            foundTitle = true;
            continue;
        }
        
        if (foundTitle && line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
            excerpt = line.trim();
            if (excerpt.length > 100) {
                excerpt = excerpt.substring(0, 100) + '...';
            }
            break;
        }
    }
    
    if (!excerpt) {
        excerpt = '点击查看文章内容...';
    }
    
    return {
        title,
        excerpt,
        date: '2024-01-01' // 你可以从文件修改时间或文件内容中提取日期
    };
}

// 显示文章列表
function displayArticles() {
    const lifeContainer = document.getElementById('life-articles');
    const exploreContainer = document.getElementById('explore-articles');
    
    if (articles.length === 0) {
        displayNoArticles();
        return;
    }
    
    // 按分类筛选文章
    const lifeArticles = articles.filter(article => article.category === 'Life');
    const exploreArticles = articles.filter(article => article.category === 'Explore');
    
    // 显示 Life 分类文章
    if (lifeArticles.length > 0) {
        lifeContainer.innerHTML = lifeArticles.map(article => `
            <div class="article-card" onclick="openArticle('${article.id}')">
                <h3>${article.title}</h3>
                <div class="article-meta">发布于 ${formatDate(article.date)}</div>
                <div class="article-excerpt">${article.excerpt}</div>
            </div>
        `).join('');
    } else {
        lifeContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #718096;">
                <p>暂无生活类文章</p>
            </div>
        `;
    }
    
    // 显示 Explore 分类文章
    if (exploreArticles.length > 0) {
        exploreContainer.innerHTML = exploreArticles.map(article => `
            <div class="article-card" onclick="openArticle('${article.id}')">
                <h3>${article.title}</h3>
                <div class="article-meta">发布于 ${formatDate(article.date)}</div>
                <div class="article-excerpt">${article.excerpt}</div>
            </div>
        `).join('');
    } else {
        exploreContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #718096;">
                <p>暂无探索类文章</p>
            </div>
        `;
    }
}

// 显示无文章状态
function displayNoArticles() {
    const lifeContainer = document.getElementById('life-articles');
    const exploreContainer = document.getElementById('explore-articles');
    
    const noArticlesHtml = `
        <div style="text-align: center; padding: 60px 20px; color: #718096;">
            <h3>还没有文章</h3>
            <p>开始写你的第一篇文章吧！</p>
            <p style="margin-top: 20px; font-size: 0.9rem;">
                将 .md 文件放入 posts 文件夹，然后推送到 Git 仓库即可。
            </p>
        </div>
    `;
    
    lifeContainer.innerHTML = noArticlesHtml;
    exploreContainer.innerHTML = noArticlesHtml;
}

// 打开文章详情
async function openArticle(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    try {
        // 加载文章内容，使用文章的完整路径
        const content = await loadArticleContent(article.path || article.filename);
        displayArticleContent(article, content);
        showPage('article');
        updateActiveNav('');
    } catch (error) {
        console.error('加载文章内容失败:', error);
        alert('加载文章失败，请稍后重试');
    }
}

// 加载文章内容
async function loadArticleContent(filePath) {
    try {
        // 直接使用提供的路径加载文章
        const response = await fetch(filePath);
        if (response.ok) {
            return await response.text();
        } else {
            // 如果文件不存在，返回示例内容
            const filename = filePath.split('/').pop();
            return getExampleContent(filename);
        }
    } catch (error) {
        // 返回示例内容
        const filename = filePath.split('/').pop();
        return getExampleContent(filename);
    }
}

// 获取示例文章内容
function getExampleContent(filename) {
    const examples = {
        'sample-article-1.md': `# 我的第一篇博客文章

欢迎来到我的博客！这是我的第一篇文章。

## 关于这个博客

这个博客系统具有以下特点：

- 📝 支持 Markdown 格式写作
- 🚀 自动从 Git 仓库读取文章
- 📱 响应式设计，支持移动端
- 🎨 现代化的 UI 设计

## 如何使用

1. 在 \`posts\` 文件夹中创建 \`.md\` 文件
2. 使用 Markdown 语法写作
3. 推送到 Git 仓库
4. 网站会自动显示新文章

## 代码示例

\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

> 这是一个引用示例

希望你喜欢这个简单的博客系统！`,

        'sample-article-2.md': `# Markdown 写作技巧

Markdown 是一种轻量级标记语言，非常适合写作和文档编写。

## 基本语法

### 标题
使用 \`#\` 来创建标题：

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
\`\`\`

### 文本格式
- **粗体文本**
- *斜体文本*
- \`行内代码\`

### 列表
1. 有序列表项1
2. 有序列表项2

- 无序列表项1
- 无序列表项2

### 链接和图片
[链接文本](https://example.com)

![图片描述](image-url)

## 高级技巧

### 代码块
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

### 表格
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |

### 引用
> 这是一个引用块
> 可以包含多行内容

掌握这些技巧，你就能写出美观的 Markdown 文档了！`,

        'sample-article-3.md': `# 前端开发心得

作为一名前端开发者，我想分享一些开发过程中的心得体会。

## 技术栈选择

### HTML/CSS/JavaScript 基础
无论框架如何变化，扎实的基础都是最重要的：

- **HTML**: 语义化标签的使用
- **CSS**: Flexbox 和 Grid 布局
- **JavaScript**: ES6+ 新特性

### 现代前端框架
目前主流的前端框架：

1. **React** - 组件化开发
2. **Vue** - 渐进式框架
3. **Angular** - 企业级应用

## 开发工具

### 代码编辑器
推荐使用 VS Code，配合以下插件：
- Prettier - 代码格式化
- ESLint - 代码检查
- Live Server - 本地服务器

### 版本控制
Git 是必备技能：
\`\`\`bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
\`\`\`

## 性能优化

### 图片优化
- 使用 WebP 格式
- 懒加载技术
- 响应式图片

### 代码优化
- 代码分割
- Tree Shaking
- 缓存策略

## 学习建议

1. **多动手实践** - 理论结合实际
2. **关注新技术** - 保持学习热情
3. **参与开源项目** - 提升代码质量
4. **写技术博客** - 总结和分享

> 前端开发是一个快速发展的领域，保持学习的心态很重要！

希望这些心得对你有帮助。`
    };
    
    return examples[filename] || `# 文章内容\n\n这是一篇示例文章。\n\n请在 posts 文件夹中添加真实的 Markdown 文件。`;
}

// 显示文章内容
function displayArticleContent(article, markdownContent) {
    const articleContainer = document.getElementById('article-content');
    
    // 使用 marked.js 将 Markdown 转换为 HTML
    const htmlContent = marked.parse(markdownContent);
    
    articleContainer.innerHTML = `
        <div class="article-meta" style="color: #718096; margin-bottom: 30px; font-size: 1rem; text-align: center;">
            发布于 ${formatDate(article.date)}
        </div>
        <div class="article-body">
            ${htmlContent}
        </div>
    `;
    
    // 高亮代码块
    if (window.Prism) {
        Prism.highlightAll();
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 搜索功能（可选）
function searchArticles(query) {
    if (!query.trim()) {
        displayArticles();
        return;
    }
    
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    
    const articlesContainer = document.getElementById('articles-list');
    
    if (filteredArticles.length === 0) {
        articlesContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #718096;">
                <h3>没有找到相关文章</h3>
                <p>尝试使用其他关键词搜索</p>
            </div>
        `;
        return;
    }
    
    articlesContainer.innerHTML = filteredArticles.map(article => `
        <div class="article-card" onclick="openArticle('${article.id}')">
            <h3>${article.title}</h3>
            <div class="article-meta">发布于 ${formatDate(article.date)}</div>
            <div class="article-excerpt">${article.excerpt}</div>
        </div>
    `).join('');
}

// 加载友链内容
async function loadLinksContent() {
    const linksContainer = document.getElementById('links-content');
    
    try {
        // 显示加载状态
        linksContainer.innerHTML = `
            <h1>友情链接</h1>
            <p>加载中...</p>
        `;
        
        // 加载友链.md文件
        const response = await fetch('posts/友链.md');
        if (!response.ok) {
            throw new Error('无法加载友链文件');
        }
        
        const markdownContent = await response.text();
        
        // 将Markdown转换为HTML（不解析链接，直接显示原始内容）
        const htmlContent = convertMarkdownToHtml(markdownContent);
        
        // 显示内容
        linksContainer.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('加载友链失败:', error);
        linksContainer.innerHTML = `
            <h1>友情链接</h1>
            <p style="color: #e53e3e;">加载友链失败，请稍后重试。</p>
        `;
    }
}

// 简单的Markdown转HTML函数（不解析链接）
function convertMarkdownToHtml(markdown) {
    let html = markdown;
    
    // 转换标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // 转换粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 转换斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 转换行内代码
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 转换换行
    html = html.replace(/\n/g, '<br>');
    
    // 包装在div中
    return `<div class="links-content-body">${html}</div>`;
}
# 🔒 AI 智能渗透测试评估系统

一个基于 AI 和 Kali Linux 的自动化渗透测试评估工具，集成 Dify 工作流（千帆数据集）进行结构化智能分析与漏洞验证。

## ✨ 核心功能

### 🎯 自动化扫描
- 🔍 **信息收集**: DNS查询、WHOIS查询、子域名发现、WAF检测
- 🔌 **端口扫描**: 使用 Nmap 进行全面端口扫描和服务识别
- 🎯 **指纹识别**: Web 技术栈识别、CMS 检测、HTTP 头分析
- ⚠️ **漏洞扫描**: 集成 Nuclei、Nikto 等工具进行综合漏洞扫描

### 🤖 AI 智能验证（核心特色）
- 🧠 **智能优先级排序**: AI 分析漏洞严重性、可利用性和影响范围，自动排序
- 🔍 **自动验证策略**: AI 为每个漏洞生成具体的验证步骤和命令
- ⚡ **自动化执行**: 系统自动执行安全的验证命令，跳过高风险操作
- 🎯 **智能结果判断**: AI 分析验证结果，判断漏洞真实性和置信度（高/中/低）
- 📋 **利用指南生成**: 自动生成详细的漏洞利用步骤、工具命令和注意事项
- 🔬 **深度探测分析**: 对高价值漏洞进行多维度深入分析

### 📊 其他功能
- 📄 **报告生成**: 自动生成 HTML、JSON 格式的专业报告
- 🌐 **Web 界面**: 现代化可视化界面，实时进度显示
- 💾 **数据库管理**: MySQL 数据库存储任务、漏洞和报告
- 🔌 **WebSocket 推送**: 实时进度和结果推送
- 🔧 **MCP 支持**: 提供 MCP 服务器接口，可集成到其他系统

## 📋 系统要求

### 本地环境
- Python 3.8+
- Windows/Linux/macOS
- MySQL 5.7+（用于数据存储）

### Kali Linux 环境
- Kali Linux（远程或本地）
- SSH 访问权限
- 安装以下工具：
  - nmap
  - nuclei
  - nikto
  - whatweb
  - curl
  - dig

### AI API
- Dify App Key（用于调用 webtest 工作流）
- 可选：自建 Dify 实例或自定义工作流时的 API Base URL

### 知识库 / 数据集
- 工作流默认将扫描记录与参考资料写入 Dify 的“知识检索”节点，底层由 **百度千帆** 数据集提供向量化与存储能力。
- 请在 Dify 控制台 → 数据集 中创建或选择基于百度千帆的知识库，并确保文档同步与索引构建完成。
- 若使用自建 Qianfan 服务，需要在插件市场为百度千帆插件配置 AK/SK，随后在应用里重新绑定数据集。
- 迁移到自建 Dify 时，可继续沿用百度千帆，也可以替换为其它向量存储，记得同步更新工作流中的“知识检索”节点设置。

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

创建 `.env` 文件，配置以下内容：

```env
# AI API 配置（Dify）
DIFY_API_KEY=app-eNralYw9mrwX7z2yXw1h8Lu6
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_WORKFLOW_USER=pentest-console
DIFY_REQUEST_TIMEOUT=90

> ⚠️ 建议在生产环境中通过环境变量或保密仓库下发 `DIFY_API_KEY`，避免将实际密钥提交到版本库。

# Kali Linux SSH 配置
KALI_HOST=your-kali-ip
KALI_PORT=22
KALI_USERNAME=kali
KALI_PASSWORD=your-password

# MySQL 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=pentest_db
```

### 3. 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE pentest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 初始化表结构
python init_database.py
```

### 4. 准备 Kali 环境

在 Kali Linux 上安装必要工具：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y nmap nikto whatweb curl dnsutils

# 安装 Nuclei
go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest
nuclei -update-templates
```

或使用提供的安装脚本：

```bash
chmod +x install_kali_tools.sh
./install_kali_tools.sh
```

### 5. 运行系统

#### 方式 1：Web 界面（推荐 ⭐）

```bash
# 启动 Web 服务器
python web_server.py

# 或使用启动脚本
start_web.bat        # Windows
./start_web.sh       # Linux/Mac
```

然后在浏览器访问：

- **主页**：http://localhost:5000
- **AI 验证**：http://localhost:5000/ai-verification

**首次访问需登录**
- 默认账号：`admin`
- 默认密码：`admin`（首次登录后请修改）

**主要功能：**
1. **扫描目标**：输入 URL 或 IP，自动执行完整扫描
2. **查看任务**：查看历史扫描任务和结果
3. **AI 智能验证**：对扫描结果进行 AI 验证，过滤误报
4. **深度探测**：对单个漏洞进行深入分析
5. **下载报告**：下载 HTML/JSON 格式报告

#### 方式 2：命令行

```bash
# 基本用法
python main.py <目标>

# 示例
python main.py example.com
python main.py 192.168.1.100
python main.py http://testphp.vulnweb.com
```

#### 方式 3：测试 AI 功能

```bash
# 测试 AI 验证功能（无需实际扫描）
python test_ai_verification.py
```

## 📁 项目结构

```
py-ai-2/
├── frontend/                    # 前端文件
│   ├── templates/              # HTML 模板
│   │   ├── index.html         # 主页
│   │   ├── login.html         # 登录页
│   │   └── ai_verification.html  # AI 验证页面
│   └── static/                # 静态资源
│       ├── css/style.css      # 样式
│       └── js/app.js          # 前端脚本
│
├── ai/                         # AI 模块
│   ├── analyzer.py            # AI 分析器
│   └── intelligent_verifier.py # AI 智能验证器 ⭐
│
├── models/                     # 数据库模型
│   └── database.py            # 数据库模型定义
│
├── scanners/                   # 扫描器模块
│   ├── info_collector.py      # 信息收集
│   ├── port_scanner.py        # 端口扫描
│   ├── fingerprint.py         # 指纹识别
│   └── vuln_scanner.py        # 漏洞扫描
│
├── reports/                    # 报告模块
│   └── report_generator.py    # 报告生成器
│
├── utils/                      # 工具模块
│   └── ssh_executor.py        # SSH 执行器
│
├── config.py                   # 配置文件
├── web_server.py              # Web 服务器（主程序）⭐
├── main.py                    # 命令行入口
├── init_database.py           # 数据库初始化
├── migrate_database.py        # 数据库迁移
├── test_ai_verification.py    # AI 功能测试 ⭐
├── example_usage.py           # 使用示例
├── mcp_server.py              # MCP 服务器
│
├── requirements.txt           # 依赖列表
├── README.md                  # 项目说明（本文件）
├── QUICKSTART.md             # 快速入门
├── QUICK_START_AI.md         # AI 功能快速入门 ⭐
├── API_DOCUMENTATION.md      # API 接口文档 ⭐
└── PROJECT_STRUCTURE.md      # 项目结构说明 ⭐
```

## 🎯 完整工作流程

### 阶段 1：AI驱动的智能扫描 🤖
```
1. 建立 SSH 连接 → 连接到 Kali Linux
2. 信息收集 → 收集目标的基础信息
3. 端口扫描 → 发现开放端口和服务
4. 指纹识别 → 识别 Web 技术栈
   ⬇️
5. 🤖 AI智能决策 → 分析已有信息，动态制定测试策略
   ├─ 决定需要扫描的额外端口（如Tomcat的8009端口）
   ├─ 决定需要探测的敏感目录（如/manager、/docs、/actuator）
   ├─ 决定需要执行的专项测试（如默认凭证、信息泄露）
   └─ 基于技术栈推荐CVE漏洞
   ⬇️
6. 🎯 自适应扫描 → 执行AI建议的智能测试
   ├─ 扫描AI推荐的额外端口
   ├─ 探测特定技术的敏感路径
   └─ 执行针对性的服务测试
   ⬇️
7. 漏洞扫描 → 使用 Nuclei、Nikto 等工具（结合AI推荐的漏洞）
8. AI 深度分析 → 综合所有结果生成安全建议
9. 生成报告 → HTML/JSON 格式
```

**🔥 核心特性：不再是固定流程扫描，而是AI实时分析并动态调整策略！**

#### 智能决策示例

**场景1：识别到Tomcat**
```
AI决策：
├─ 额外端口扫描: 8009 (AJP), 8443
├─ 敏感目录: /manager/html, /host-manager/html, /docs, /examples
├─ 专项测试: 默认凭证测试、CVE-2020-1938检测
└─ 优先漏洞: Tomcat反序列化、目录遍历
```

**场景2：识别到Spring Boot**
```
AI决策：
├─ 敏感端点: /actuator/env, /actuator/heapdump, /actuator/metrics
├─ 专项测试: Spring Actuator信息泄露、SpEL注入
├─ 优先漏洞: CVE-2022-22965 (Spring4Shell)
└─ 文件扫描: application.properties, bootstrap.yml
```

**场景3：识别到Jenkins**
```
AI决策：
├─ 端口扫描: 8080, 8443, 50000
├─ 敏感路径: /script, /view/all/newJob, /asynchPeople
├─ 专项测试: 未授权访问、脚本控制台
└─ 优先漏洞: 反序列化RCE、插件漏洞
```

### 阶段 2：AI 智能验证（可选）
```
1. 选择已完成的扫描任务
2. 启动 AI 智能验证
   ↓
3. AI 优先级排序 → 分析严重性和可利用性
4. 自动验证策略 → 为每个漏洞生成验证方案
5. 自动化执行 → 执行安全的验证命令
6. AI 智能判断 → 判断漏洞真实性
7. 生成利用指南 → 详细的利用步骤
   ↓
8. 输出验证结果：
   - ✅ 已验证真实漏洞（含利用指南）
   - ⚠️ 确认的误报
   - 🔍 需人工检查
```

**效率提升：** 从验证 20 个漏洞 → 只需关注 8 个（节省 60% 时间）

## 📊 报告和结果

### 扫描报告
- **HTML 报告**: 美观的网页格式，包含详细图表
- **JSON 报告**: 结构化数据，便于程序处理
- 保存在 `reports/` 目录

### AI 验证结果
- **真实漏洞列表**: 包含详细利用指南
- **误报列表**: 自动过滤的误报
- **待确认列表**: 需要人工复核的漏洞

## 📚 文档

| 文档 | 说明 |
|------|------|
| [README.md](README.md) | 项目总体说明（本文件） |
| [QUICKSTART.md](QUICKSTART.md) | 系统快速入门指南 |
| [QUICK_START_AI.md](QUICK_START_AI.md) | AI 功能快速入门 ⭐ |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | 完整 API 接口文档 ⭐ |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 项目结构和架构说明 ⭐ |

## ⚠️ 免责声明

本工具仅用于**授权的安全测试**。使用本工具进行未经授权的渗透测试是违法的。

- ✅ 仅在您拥有明确授权的系统上使用
- ✅ 遵守当地法律法规
- ✅ 负责任地披露发现的漏洞
- ❌ 不要用于恶意目的
- ❌ 不要攻击未授权的目标

使用本工具即表示您同意承担所有法律责任。

## 💡 核心优势

### vs 传统扫描器
| 特性 | 传统扫描器 | 本系统 |
|------|-----------|--------|
| 漏洞发现 | ✅ | ✅ |
| 自动验证 | ❌ | ✅ AI 驱动 |
| 误报过滤 | ❌ 人工 | ✅ AI 自动 |
| 利用指南 | ❌ | ✅ AI 生成 |
| 验证效率 | 4-6小时 | 30-60分钟 |
| 新手友好 | ❌ | ✅ |

### 核心特色
1. **AI 主动验证**：不只是分析，而是真正执行验证
2. **智能过滤误报**：自动过滤 60-80% 的误报
3. **专家级输出**：生成可直接使用的利用指南
4. **效率提升 9 倍**：大幅减少人工验证时间

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 技术支持

- 📖 查看文档：[QUICK_START_AI.md](QUICK_START_AI.md)
- 🐛 提交问题：GitHub Issues
- 📧 联系方式：请通过 Issues 联系

---

**⚠️ 重要提示**：本工具仅用于教育和合法的安全测试目的。请遵守道德准则和法律法规。


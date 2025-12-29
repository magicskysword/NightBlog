# Night Blog

基于 Hexo 的个人博客仓库，使用 NexT 主题。

## 项目结构

```
├── source/           # 博客文章源文件
│   └── _posts/       # 发布的文章
├── themes/           # 主题目录
│   └── next/         # NexT 主题
├── scaffolds/        # 文章模板
├── _config.yml       # Hexo 主配置
└── package.json      # 项目依赖
```

## 本地开发

### 安装依赖

```bash
pnpm install

# 安装主题依赖（如果有）
cd themes/next && pnpm install
```

### 启动开发服务器

```bash
pnpm run server
```

### 构建静态文件

```bash
pnpm run build
```

构建后的文件在 `public/` 目录。

## 自动部署

### GitHub Secrets 配置

在仓库设置中添加以下 Secrets：

| Secret 名称 | 说明 |
|------------|------|
| `DEPLOY_WEBHOOK_URL` | 部署器的 Webhook URL，如 `https://your-deployer.com/api/update` |
| `DEPLOY_WEBHOOK_TOKEN` | 部署器的验证 Token |

### 工作流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建博客
3. 构建产物打包为 `blog-release.zip` 并发布到 Releases
4. 通过 Webhook 通知部署器更新

## 相关仓库

- [Blog Deployer](https://github.com/your-username/blog-deployer) - 博客部署服务

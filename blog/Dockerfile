FROM node:22

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制包管理配置文件
COPY package.json pnpm-lock.yaml ./

# 安装主项目依赖（包含 hexo、主题依赖声明）
RUN pnpm install

# 复制所有源代码
COPY . .

# 单独为 NexT 主题安装依赖（防止部分脚本 require 报错）
RUN if [ -f themes/next/package.json ]; then \
      cd themes/next && pnpm install || true; \
    fi

# 构建静态页面
RUN pnpm run build

# 启动本地 Hexo 服务器
EXPOSE 4000
# 如果设置了 BUILD_ONLY=true，则容器启动时什么也不做
# 否则，启动 Hexo 本地服务器
CMD ["/bin/sh", "-c", "if [ \"$BUILD_ONLY\" != \"true\" ]; then pnpm run server; else echo 'Build only mode. Nothing to run.'; fi"]

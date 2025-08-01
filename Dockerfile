FROM node:22

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制所有源代码
COPY . .

# 构建静态文件
RUN pnpm run build

# 启动服务器
EXPOSE 4000
CMD ["pnpm", "run", "server"]
const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { downloadAndExtract } = require('./deploy');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.UPDATE_TOKEN;
const BLOG_ZIP_URL = process.env.BLOG_ZIP_URL;
const DEPLOY_DIR = process.env.DEPLOY_DIR || path.join(__dirname, 'public');

// 提供静态网站服务
app.use('/', express.static(DEPLOY_DIR));

// 接收更新 API
app.post('/api/update', async (req, res) => {
  const reqToken = req.query.token;
  if (reqToken !== TOKEN) {
    return res.status(403).json({ message: '禁止访问：Token 无效' });
  }

  try {
    console.log('✅ 接收到远程更新请求，开始更新博客...');
    await downloadAndExtract(BLOG_ZIP_URL, DEPLOY_DIR);
    console.log('✅ 博客更新成功！');
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('❌ 更新失败：', err);
    res.status(500).json({ message: '更新失败', error: err.message });
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
  console.log('⏳ 正在执行初始部署...');
  try {
    await downloadAndExtract(BLOG_ZIP_URL, DEPLOY_DIR);
    console.log('✅ 初始部署完成！');
  } catch (err) {
    console.error('❌ 初始部署失败：', err);
  }
});

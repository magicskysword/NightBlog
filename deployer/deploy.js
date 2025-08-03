const { http, https } = require('follow-redirects');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

/**
 * 下载 zip 并解压到目标目录（会先清空该目录）
 * @param {string} url 下载地址
 * @param {string} targetDir 解压目录
 */
async function downloadAndExtract(url, targetDir) {
  const tmpZip = path.join('/tmp', 'blog.zip');

  // 下载 zip 文件
  if (!url) {
    throw new Error('URL is required');
  }
  console.log(`Downloading ${url}...`);
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmpZip);
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download: ${response.statusCode}`)
          );
        }
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', reject);
  });

  const stats = fs.statSync(tmpZip);
  console.log(`Downloaded zip size: ${stats.size} bytes`);

  // 清空目标目录
  if (fs.existsSync(targetDir)) {
    console.log(`Removing existing directory: ${targetDir}`);
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });

  // 解压（使用 adm-zip）
  console.log(`Extracting to ${targetDir}...`);
  const zip = new AdmZip(tmpZip);
  zip.extractAllTo(targetDir, true);

  fs.unlinkSync(tmpZip);
  console.log('Deploy complete.');
}

module.exports = { downloadAndExtract };

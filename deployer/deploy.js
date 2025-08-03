const { http, https } = require('follow-redirects');
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');
const { pipeline } = require('stream/promises');

async function downloadAndExtract(url, targetDir) {
  const tmpZip = path.join('/tmp', 'blog.zip');

  // Download zip
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

  // Clean target directory
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });

  // Extract
  console.log(`Extracting to ${targetDir}...`);
  await pipeline(
    fs.createReadStream(tmpZip),
    unzipper.Extract({ path: targetDir })
  );

  fs.unlinkSync(tmpZip); // Clean up
  console.log('Deploy complete.');
}

module.exports = { downloadAndExtract };

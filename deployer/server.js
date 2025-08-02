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

// Serve static website
app.use('/', express.static(DEPLOY_DIR));

// API trigger
app.post('/api/update', async (req, res) => {
  const reqToken = req.query.token;
  if (reqToken !== TOKEN) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }

  try {
    console.log('Triggered update via API.');
    await downloadAndExtract(BLOG_ZIP_URL, DEPLOY_DIR);
    res.json({ message: 'Update successful' });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Performing initial deployment...');
  try {
    await downloadAndExtract(BLOG_ZIP_URL, DEPLOY_DIR);
    console.log('Initial deployment complete.');
  } catch (err) {
    console.error('Initial deployment failed:', err);
  }
});

const { Client, RemoteAuth } = require('whatsapp-web.js');
const { getStore } = require('../mongoStore');
const QRCode = require('qrcode');

const sessions = new Map();

const createClient = async (userId) => {
  if (sessions.has(userId)) return sessions.get(userId);

  const store = getStore();

  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      clientId: userId, // Unique per user
    }),
    puppeteer: {
      headless: 'new', // Use modern headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--disable-software-rasterizer',
      ],
      // Optionally specify chromium executable path if needed
      // executablePath: '/usr/bin/chromium-browser',
    },
  });

  client.on('qr', async (qr) => {
    const qrData = await QRCode.toDataURL(qr);
    client.qr = qrData;
    console.log(`📸 [${userId}] QR code updated`);
  });

  client.on('ready', () => {
    console.log(`✅ [${userId}] Client is ready`);
    client.isReady = true;
    client.qr = null;
  });

  client.on('authenticated', () => {
    console.log(`🔐 [${userId}] Authenticated`);
  });

  client.on('auth_failure', () => {
    console.error(`❌ [${userId}] Authentication failed`);
    client.isReady = false;
  });

  client.on('disconnected', () => {
    console.warn(`⚠️ [${userId}] Client disconnected`);
    sessions.delete(userId);
  });

  await client.initialize();
  sessions.set(userId, client);
  return client;
};

module.exports = { createClient, sessions };

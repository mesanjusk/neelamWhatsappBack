const { Client, RemoteAuth } = require('whatsapp-web.js');
const { getStore } = require('../mongoStore');
const QRCode = require('qrcode');

const sessions = new Map();

const createClient = async (userId) => {
  if (sessions.has(userId)) return sessions.get(userId);

  const store = getStore();

 const client = new Client({
  authStrategy: new RemoteAuth({
    store: getStore(),
    clientId: userId,
    backupSyncIntervalMs: 300000,
  }),
  puppeteer: {
    headless: true,  // or try true if xvfb doesn't work
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

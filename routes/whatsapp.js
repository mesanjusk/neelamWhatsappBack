const express = require('express');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { getStore } = require('../mongoStore');
const QRCode = require('qrcode');

const router = express.Router();

const clients = {};    
const qrCodes = {};    
const readyStatus = {}; 

const createClient = (userId) => {
  if (clients[userId]) return clients[userId]; 

  const client = new Client({
    authStrategy: new RemoteAuth({
      store: getStore(),
      clientId: userId,
      backupSyncIntervalMs: 300000, 
    }),
    puppeteer: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  client.on('qr', async (qr) => {
    qrCodes[userId] = await QRCode.toDataURL(qr);
    readyStatus[userId] = false;
  });

  client.on('ready', () => {
    readyStatus[userId] = true;
    qrCodes[userId] = null;
  });

  client.on('authenticated', () => {
    console.log(`🔐 Authenticated: ${userId}`);
  });

  client.on('auth_failure', (msg) => {
    console.error(`Authentication failure for ${userId}:`, msg);
  });

  client.on('disconnected', (reason) => {
    delete clients[userId];
    delete readyStatus[userId];
    delete qrCodes[userId];
  });

  client.initialize();
  clients[userId] = client;
  return client;
};

router.get('/start/:userId', (req, res) => {
  const { userId } = req.params;

  if (!clients[userId]) {
    createClient(userId);
    return res.json({ status: 'initializing' });
  }

  if (readyStatus[userId]) {
    return res.json({ status: 'ready' });
  }

  if (qrCodes[userId]) {
    return res.json({ status: 'qr', qr: qrCodes[userId] });
  }

  return res.json({ status: 'waiting' });
});

router.post('/send/:userId', async (req, res) => {
  const { userId } = req.params;
  const { number, message } = req.body;

  const client = clients[userId];

  if (!client || !readyStatus[userId]) {
    return res.status(503).json({ error: 'Client not ready' });
  }

  try {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.json({ status: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

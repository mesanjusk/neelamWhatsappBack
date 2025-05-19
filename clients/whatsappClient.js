const { Client, RemoteAuth } = require('whatsapp-web.js');
const { getStore } = require('./mongoStore');

const userId = 'user123';  // example

const client = new Client({
  authStrategy: new RemoteAuth({
    store: getStore(),
    clientId: userId,
    backupSyncIntervalMs: 300000,
  }),
  puppeteer: { headless: false }
});

client.on('qr', (qr) => console.log('QR:', qr));
client.on('ready', () => console.log('Client ready'));
client.on('authenticated', () => console.log('Authenticated'));
client.initialize();

const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://whatsapp-sigma-bay.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ✅ TEST ROUTE – add this block
app.get('/api/whatsapp/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// 👇 Load your real WhatsApp routes AFTER test route
const { initMongoStore } = require('./mongoStore');
const whatsappRouter = require('./routes/whatsapp');
app.use('/api/whatsapp', whatsappRouter);

// 👇 Start server
initMongoStore().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

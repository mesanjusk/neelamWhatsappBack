const express = require('express');
const cors = require('cors');

const app = express(); // ✅ Declare app FIRST

// ✅ Then use it
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

const { initMongoStore } = require('./mongoStore');
const whatsappRouter = require('./routes/whatsapp');

app.use(express.json());
app.use('/api/whatsapp', whatsappRouter);

initMongoStore().then(() => {
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
});

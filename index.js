const express = require('express');
const cors = require('cors');

const app = express();

// ✅ CORS config for Vercel frontend
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

// ✅ Health check route
app.get('/api/whatsapp/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// ✅ JSON parser
app.use(express.json());

// ✅ Mongo and Routes
const { initMongoStore } = require('./mongoStore');
const whatsappRouter = require('./routes/whatsapp');
app.use('/api/whatsapp', whatsappRouter);

// ✅ Start the server (dynamic port for Railway)
const PORT = process.env.PORT || 5000;
initMongoStore().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

const express = require('express');
const cors = require('cors'); 
const { initMongoStore } = require('./mongoStore');
const whatsappRouter = require('./routes/whatsapp');

const app = express();

app.use(cors()); 
app.use(express.json());
app.use('/api/whatsapp', whatsappRouter);

initMongoStore().then(() => {
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
});

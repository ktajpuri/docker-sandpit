const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const cardsRoutes = require('./routes/cards.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', async (_req, res) => {
  const redis = require('./config/redis');
  const redisOk = await redis.ping().then(() => true).catch(() => false);
  res.json({ status: 'ok', redis: redisOk ? 'connected' : 'disconnected' });
});
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);

app.use(errorHandler);

module.exports = app;

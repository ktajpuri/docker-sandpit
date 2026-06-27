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

// Shallow liveness check for the ALB target group: returns 200 unconditionally,
// independent of DB/Redis reachability, so slow dependency boot can't fail it.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Deep check (manual use): reports Redis connectivity without blocking /health.
app.get('/health/deep', async (_req, res) => {
  const redis = require('./config/redis');
  const redisOk = await redis.ping().then(() => true).catch(() => false);
  res.json({ status: 'ok', redis: redisOk ? 'connected' : 'disconnected' });
});
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);

app.use(errorHandler);

module.exports = app;

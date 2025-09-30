const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_API_KEY = process.env.NODE_API_KEY || '';
const EXPO_PUSH_URL = process.env.EXPO_PUSH_URL || 'https://exp.host/--/api/v2/push/send';

app.use(express.json());

// Auth middleware (Bearer token)
app.use((req, res, next) => {
  if (req.path.startsWith('/v1/')) {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    if (!NODE_API_KEY || token !== NODE_API_KEY) {
      return res.status(403).json({ message: 'Invalid API key' });
    }
  }
  next();
});

// Strip HTML helper
const stripHtml = (html) => (html ? html.replace(/<[^>]+>/g, '').trim() : '');

// POST /v1/push
app.post('/v1/push', async (req, res) => {
  const { audiences, notification } = req.body || {};

  if (!Array.isArray(audiences) || audiences.length === 0) {
    return res.status(400).json({ message: 'audiences is required (array) and cannot be empty' });
  }
  if (!notification || !notification.title || !notification.body_text) {
    return res.status(400).json({ message: 'notification.title and notification.body_text are required' });
  }

  const allTokens = [];
  for (const audience of audiences) {
    if (Array.isArray(audience.expo_push_tokens)) {
      allTokens.push(...audience.expo_push_tokens);
    }
  }

  const validTokens = allTokens.filter((t) => typeof t === 'string' && t.startsWith('ExponentPushToken['));
  if (validTokens.length === 0) {
    return res.status(400).json({ message: 'No valid Expo push tokens' });
  }

  const chunks = [];
  for (let i = 0; i < validTokens.length; i += 100) {
    chunks.push(validTokens.slice(i, i + 100));
  }

  const tickets = [];
  let accepted = 0;
  let rejected = 0;

  for (const chunk of chunks) {
    const expoMessages = chunk.map((to) => ({
      to,
      title: notification.title,
      body: stripHtml(notification.body_text),
      data: notification.data || {},
      sound: notification.sound || 'default',
      ttl: notification.ttl || 86400,
      priority: notification.priority || 'default',
    }));

    try {
      const expoResp = await axios.post(EXPO_PUSH_URL, expoMessages, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      });
      if (expoResp?.data?.data && Array.isArray(expoResp.data.data)) {
        expoResp.data.data.forEach((ticket, idx) => {
          tickets.push({ token: chunk[idx], ...ticket });
          if (ticket.status === 'ok') accepted += 1; else rejected += 1;
        });
      }
    } catch (error) {
      const message = error?.response?.data?.errors?.[0]?.message || error?.message || 'Unknown error';
      chunk.forEach((token) => {
        tickets.push({ token, status: 'error', message });
        rejected += 1;
      });
    }
  }

  return res.json({ message: 'queued', accepted, rejected, tickets });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
  console.log(`API Key: ${NODE_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
});



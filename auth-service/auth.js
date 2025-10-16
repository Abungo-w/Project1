const express = require('express');
const app = express();
app.use(express.json());

const users = { "test": "password123", "alice": "pass123" };

app.post('/auth', (req, res) => {
  const { user } = req.body;
  res.json({ valid: users[user] ? true : false });
});

app.listen(4000, () => console.log('Auth Service running on 4000'));

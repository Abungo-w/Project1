const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'mysql-db',
  user: 'root',
  password: 'password',
  database: 'data_db'
});

// Enter data endpoint
app.post('/enter', async (req, res) => {
  const { user, value } = req.body;

  // Authenticate user
  try {
    const authRes = await axios.post('http://auth-service:4000/auth', { user });
    if (!authRes.data.valid) return res.status(401).send('Unauthorized');
  } catch {
    return res.status(500).send('Auth service error');
  }

  // Insert data
  db.query('INSERT INTO data_table (user, value) VALUES (?, ?)', [user, value], (err) => {
    if (err) return res.status(500).send('DB error');
    res.send('Data entered');
  });
});

app.listen(3000, () => console.log('Enter Data Service running on 3000'));

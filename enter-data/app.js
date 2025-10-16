const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql-db',
  user: 'root',
  password: 'password',
  database: 'data_db'
});

// Create table if not exists
db.query(`CREATE TABLE IF NOT EXISTS data_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(50),
  value FLOAT
)`);

app.post('/enter', async (req, res) => {
  const { user, value } = req.body;

  try {
    const authRes = await axios.post('http://auth-service:4000/auth', { user });
    if (!authRes.data.valid) return res.status(401).send('Unauthorized');
  } catch {
    return res.status(500).send('Auth service error');
  }

  db.query('INSERT INTO data_table (user, value) VALUES (?, ?)', [user, value], (err) => {
    if (err) return res.status(500).send('DB error');
    res.send('Data entered');
  });
});

app.listen(3000, () => console.log('Enter Data Service running on 3000'));

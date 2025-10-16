const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'mysql-db',
    user: 'user',
    password: 'userpassword',
    database: 'projectdb'
});

db.connect(err => {
    if(err) throw err;
    console.log("Connected to MySQL");
});

app.post('/enter', async (req, res) => {
    const { username, password, value } = req.body;

    try {
        // Validate credentials
        const authRes = await axios.post('http://auth-service:4000/login', { username, password });
        if(!authRes.data.success) return res.status(401).send("Unauthorized");

        // Insert data into MySQL
        db.query('INSERT INTO data_table (value) VALUES (?)', [value], (err) => {
            if(err) return res.status(500).send(err);
            res.send("Data saved successfully");
        });
    } catch (err) {
        res.status(401).send("Authentication failed");
    }
});

app.listen(3000, () => console.log("Enter Data service running on port 3000"));



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
    password: 'password',
    database: 'projectdb'
});

function connectWithRetry(retries = 5, delay = 2000) {
    db.connect(err => {
        if(err) {
            if(retries > 0) {
                console.log(`MySQL connection failed. Retrying in ${delay/1000}s... (${retries} retries left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error("Failed to connect to MySQL after multiple attempts");
                throw err;
            }
        } else {
            console.log("Connected to MySQL");
        }
    });
}

connectWithRetry();

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



const express = require('express');
const cors = require('cors'); 

const app = express();


app.use(cors());


app.use(express.json());

const users = {
    "admin": "admin",
    "user": "user"
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (users[username] === password) {
        return res.status(200).json({ message: "Login successful" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5000');
});


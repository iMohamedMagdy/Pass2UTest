const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// استخدام Environment Variable للمفتاح
const API_KEY = process.env.API_KEY;
const PASS_ID = "Jn11aKQqu5TM";

app.get('/test-pass', async (req, res) => {
    try {
        const date = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const hash = crypto.createHash('sha256').update(API_KEY).digest('base64');

        const headers = {
            'Authorization': `PassKey ${hash}`,
            'X-Amz-Date': date
        };

        const response = await axios.get(`https://api.pass2u.net/v2/pass/${PASS_ID}`, { headers });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
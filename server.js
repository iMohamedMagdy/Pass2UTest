const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ======================================
// ⚡ Environment Variables
// ======================================
const API_KEY = process.env.API_KEY || "6355b99f8563ce45c198f5a9eaf45d2d"; 
const PASS_ID = "Jn11aKQqu5TM";

// ======================================
// ✅ Health Check Endpoint
// ======================================
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    time: new Date().toISOString()
  });
});

// ======================================
// ✅ Test Pass Endpoint
// ======================================
app.get('/test-pass', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY not set" });
  }

  try {
    const response = await axios.get(
      `https://api.pass2u.net/v2/pass/${PASS_ID}`,
      { headers: { "X-API-Key": API_KEY } }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// ======================================
// ⚡ Start Server on Railway Port
// ======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
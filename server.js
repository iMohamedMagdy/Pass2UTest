const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Environment Variables
const API_KEY = process.env.API_KEY;  // لازم يكون مضبوط على Railway
const PASS_ID = "Jn11aKQqu5TM";

// 🔹 Health Endpoint (آمن تمامًا)
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    time: new Date().toISOString()
  });
});

// 🔹 Test Pass Endpoint (يحمي السيرفر من أي خطأ)
app.get('/test-pass', async (req, res) => {
  if (!API_KEY) {
    return res.status(400).json({ error: "API_KEY not set in environment variables" });
  }

  try {
    const response = await axios.get(
      `https://api.pass2u.net/v2/pass/${PASS_ID}`,
      {
        headers: { "X-API-Key": API_KEY },
        timeout: 5000 // Timeout 5 ثواني
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Pass2U API:", error.message);
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});

// 🔹 Port صح مع تحديد الـ Host لـ 0.0.0.0
const PORT = process.env.PORT || 3000;

// التعديل الجوهري: إضافة '0.0.0.0'
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is up and running on port ${PORT}`);
});
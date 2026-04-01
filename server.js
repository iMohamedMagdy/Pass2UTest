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

app.get('/test-pass', async (req, res) => {
  // 🔹 للتأكد إن الـ Key واصل للسيرفر (هيظهر في الـ Logs عندك)
  console.log("Current API_KEY length:", API_KEY ? API_KEY.length : "0 (Undefined!)");

  if (!API_KEY) {
    return res.status(400).json({ error: "API_KEY is missing in Railway Variables" });
  }

  try {
    const response = await axios.get(
      `https://api.pass2u.net/v2/passes/${PASS_ID}`, // ⬅️ تأكد من الـ (s) في passes
      {
        headers: { 
          "x-api-key": API_KEY.trim(), // ⬅️ استعملنا Small letter وعملنا trim للمسافات
          "Accept": "application/json"
        },
        timeout: 10000
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Pass2U API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
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
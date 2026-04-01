const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔹 الـ Key هنا لو Railway مبعتوش، الكود هيستخدم ده كـ "خطة بديلة"
const API_KEY = process.env.API_KEY || "6355b99f8563ce45c198f5a9eaf45d2d";
const PASS_ID = "Jn11aKQqu5TM";

// 🔹 Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    time: new Date().toISOString()
  });
});

// 🔹 Test Pass Endpoint
app.get('/test-pass', async (req, res) => {
  const cleanKey = API_KEY.trim();
  
  try {
    const response = await axios({
      method: 'get',
      url: `https://api.pass2u.net/v2/passes/${PASS_ID}`, // الـ URL الصح للكروت
      headers: { 
        'x-api-key': cleanKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Pass2U API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// 🔹 الإعدادات الصحيحة للـ Port والـ Host لـ Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is up and running on port ${PORT}`);
});
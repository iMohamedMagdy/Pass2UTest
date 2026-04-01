const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔹 الـ Key والـ ID (الخطة البديلة لو الـ Environment Variables مجاتش)
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

// 🔹 Test Pass Endpoint (النسخة النهائية المضمونة)
app.get('/test-pass', async (req, res) => {
  const cleanKey = API_KEY.trim();
  
  console.log(`[Log] Testing with Key: ${cleanKey.substring(0, 4)}...`);

  try {
    const response = await axios({
      method: 'get',
      url: `https://api.pass2u.net/v2/passes/${PASS_ID}`,
      headers: { 
        'X-API-Key': cleanKey, // التعديل الجوهري في حالة الأحرف
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    // لو لسه فيه مشكلة، السيرفر هيقولنا السبب الحقيقي (Token ولا حاجة تانية)
    console.error("Pass2U Error Details:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// 🔹 إعدادات السيرفر لـ Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is up and running on port ${PORT}`);
});
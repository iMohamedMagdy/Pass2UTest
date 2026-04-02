const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 🔹 البيانات المستخرجة من الصور بتاعتك
const API_KEY = process.env.API_KEY || "6355b99f8563ce45c198f5a9eaf45d2d";
const MODEL_ID = "373769"; // الـ Model ID من الصورة الأخيرة
const PASS_ID = "Jn11aKQqu5TM"; // الـ Pass ID من أول صورة

// 🔹 Health Check
app.get('/health', (req, res) => {
  res.json({ status: "ok", model: MODEL_ID });
});

// 🔹 الحصول على بيانات الكارت (Get Pass Details)
app.get('/test-pass', async (req, res) => {
  const cleanKey = API_KEY.trim();
  
  try {
    const response = await axios({
      method: 'get',
      // 💡 الـ URL الصح حسب الـ Documentation: models/{modelId}/passes/{passId}
      url: `https://api.pass2u.net/v2/models/${MODEL_ID}/passes/${PASS_ID}`,
      headers: { 
        'x-api-key': cleanKey,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    res.json({
      success: true,
      message: "Pass data retrieved successfully!",
      data: response.data
    });

  } catch (error) {
    console.error("Error fetching pass:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message,
      context: "Make sure API Key is correct in Railway Variables"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running on port ${PORT}`);
});
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
  const MODEL_ID = "373769"; 
  const PASS_ID = "Jn11aKQqu5TM";

  try {
    const response = await axios({
      method: 'get',
      url: `https://api.pass2u.net/v2/models/${MODEL_ID}/passes/${PASS_ID}`,
      headers: { 
        'x-api-key': cleanKey,
        // 💡 التعديل الجوهري هنا: بنقوله ابعتلنا الـ JSON بتاع الكارت
        'Accept': 'application/json' 
      },
      timeout: 10000
    });

    res.json({
      success: true,
      message: "Data Captured!",
      data: response.data
    });

  } catch (error) {
    // لو لسه بيتدلع وبيطلب vnd.apple.pkpass، هنخليه يرجع الـ Raw Data
    console.error("Pass2U Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message,
      tip: "If you want to download the file, change Accept to application/vnd.apple.pkpass"
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running on port ${PORT}`);
});
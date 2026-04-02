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
// 🔹 تحديث النقاط لـ 100 نقطة (تجربة)
app.get('/update-points', async (req, res) => {
  const cleanKey = API_KEY.trim();
  const MODEL_ID = "373769"; 
  const PASS_ID = "Jn11aKQqu5TM";

  try {
    const response = await axios({
      method: 'put', // الـ Method هنا لازم PUT حسب الكتالوج
      url: `https://api.pass2u.net/v2/models/${MODEL_ID}/passes/${PASS_ID}`,
      headers: { 
        'x-api-key': cleanKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        "fields": [
          {
            "key": "points", // ده المفتاح اللي شفناه في صورتك
            "value": "100",  // هنخلي النقاط 100
            "changeMessage": "مبروك! نقاطك بقت %@" // الرسالة اللي هتظهر للمستخدم
          }
        ]
      }
    });

    res.json({
      success: true,
      message: "Points updated successfully!",
      updatedData: response.data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running on port ${PORT}`);
});
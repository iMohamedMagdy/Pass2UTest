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
        'Accept': 'application/vnd.apple.pkpass' // وافقنا على شروطه
      },
      responseType: 'arraybuffer', // عشان نستلم "ملف" مش "نص"
      timeout: 10000
    });

    // 💡 بنقول للمتصفح: "خد الملف ده نوعه كارت أبل واسمه pass.pkpass"
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', 'attachment; filename=pass.pkpass');
    
    // ابعت الملف!
    res.send(response.data);

  } catch (error) {
    // لو حصل مشكلة، هنرجع نشوف الـ JSON بتاع الـ Error
    let errorData = error.message;
    if (error.response && error.response.data) {
        errorData = error.response.data.toString(); // تحويل البافر لنص
    }
    
    res.status(500).json({
      success: false,
      error: errorData,
      log: "Failed to fetch .pkpass file"
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running on port ${PORT}`);
});
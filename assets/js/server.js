const express = require('express');
const cors = require('cors');
const app = express();

// تفعيل CORS واستقبال بيانات JSON
app.use(cors());
app.use(express.json());

// استيراد ملف الراوتر
const mainRouter = require('./router');

// ربط الراوتر بالسيرفر تحت المسار /api
app.use('/api', mainRouter);

// تقديم الملفات الثابتة للموقع (HTML, CSS, JS) إذا كانت في نفس المجلد
app.use(express.static(__dirname));

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن بكفاءة على المنفذ: ${PORT}`);
});
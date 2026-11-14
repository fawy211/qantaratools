const express = require('express');
const cors = require('cors');
const path = require('node:path');
const app = express();

// تفعيل CORS واستقبال بيانات JSON
app.use(cors());
app.use(express.json());

// استيراد ملف الراوتر
const mainRouter = require('./router');

// ربط الراوتر بالسيرفر تحت المسار /api
app.use('/api', mainRouter);

// تقديم جذر المشروع بالكامل حتى تعمل صفحات اللغات والمسارات ذات index.html
// مثل /de/faq/ و /fr/privacy/ عند التشغيل المحلي عبر npm start.
const projectRoot = path.resolve(__dirname, '..', '..');
app.use(express.static(projectRoot));

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن بكفاءة على المنفذ: ${PORT}`);
});

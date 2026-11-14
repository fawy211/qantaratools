const express = require('express');
const path = require('node:path');
const app = express();

// This server only serves the static website. assets/js/router.js is a
// browser-only tool loader and must never be required by Node/Express.
const projectRoot = path.resolve(__dirname, '..', '..');
app.use(express.static(projectRoot, { extensions: ['html'] }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QantaraTools static server listening on port ${PORT}`);
});

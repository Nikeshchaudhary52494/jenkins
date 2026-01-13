const express = require("express");
const app = express();

// A simple function to test
const greeting = (name) => `Hello, ${name || 'World'}! 🚀`;

app.get("/", (req, res) => {
  res.send(`
    <div style="text-align:center; font-family: sans-serif; margin-top: 50px;">
      <h1>${greeting('Jenkins User')}</h1>
      <p style="color: #666;">Deployment Status: <span style="color: green;">Online</span></p>
      <hr style="width: 200px;">
      <p>Server Time: ${new Date().toLocaleTimeString()}</p>
    </div>
  `);
});

app.get("/statu", (req, res) => {
  res.status(200).json({ 
    status: "UP", 
    environment: process.env.NODE_ENV || 'production',
    uptime: process.uptime() 
  });
});

// We separate the app logic from the server start for testing
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

module.exports = { app, greeting };
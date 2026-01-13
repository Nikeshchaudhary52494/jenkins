const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`<h1>Hello from Jenkins! 🚀</h1>
    <p>Express app is running.</p>
    <p>These are new modifications.</p>`);
});

app.get("/status", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Export for testing purposes
module.exports = server;

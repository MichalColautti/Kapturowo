// backend/src/index.js
const express = require("express");
const app = express();
const port = 5000;

app.get("/api/hello", (req, res) => {
  res.send({ message: "Hello from Backend!" });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

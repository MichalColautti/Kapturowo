const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'test' });
});

app.listen(5000, () => {
  console.log('port 5000');
});

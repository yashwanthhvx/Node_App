const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World, This is node-app');
});

app.listen(port, () => {
  console.log(`Server is running on port 3000`);
});

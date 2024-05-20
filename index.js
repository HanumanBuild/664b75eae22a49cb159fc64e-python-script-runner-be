const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/run-script', (req, res) => {
  const { script } = req.body;
  const process = spawn('python', ['-c', script]);

  let output = '';
  process.stdout.on('data', (data) => {
    output += data.toString();
  });

  process.stderr.on('data', (data) => {
    output += data.toString();
  });

  process.on('close', (code) => {
    res.json({ output });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
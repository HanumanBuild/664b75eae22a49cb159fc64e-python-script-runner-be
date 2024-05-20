const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);
  })
  .catch(error => console.error(error));

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

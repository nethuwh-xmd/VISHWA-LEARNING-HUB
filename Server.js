const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './videos.json';

// Load videos from file
function loadVideos() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save videos to file
function saveVideos(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/videos/:grade', (req, res) => {
  const grade = req.params.grade;
  const data = loadVideos();
  res.json(data[grade] || []);
});

app.post('/videos/:grade', (req, res) => {
  const grade = req.params.grade;
  const url = req.body.url;
  const data = loadVideos();
  if (!data[grade]) data[grade] = [];
  data[grade].push(url);
  saveVideos(data);
  res.json({ success: true });
});

app.delete('/videos/:grade/:index', (req, res) => {
  const { grade, index } = req.params;
  const data = loadVideos();
  if (data[grade]) {
    data[grade].splice(index, 1);
    saveVideos(data);
  }
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
require('dotenv').config();

const root = require('path').join(__dirname, 'build')
app.use(express.static(root));

let trackData = {};

const robKey = process.env.ROB_KEY
const robName = process.env.ROB_NAME

const fetchTrack = async () => {
  const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${robName}&api_key=${robKey}&format=json&limit=1`);
  const data = await res.data;
  return data;
}

const getTracks = async () => {
  const d = await fetchTrack()
  trackData = d
}
getTracks()
setInterval(async () => {
  await getTracks()
}, 6000);

app.get('/api/trackData.json', async (req, res) => {
  res.json(trackData)
})

app.get('/*', async (req, res) => {
  res.sendFile('index.html', { root });
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
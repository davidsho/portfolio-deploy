const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const root = require('path').join(__dirname, 'build')
app.use(express.static(root));
// app.use(express.static(path.join(__dirname, 'build')));
console.log(root);
let trackData = {};
let topArtistData = {};
const davidKey = "dffc35d8f8602596a39469caa1739857"
const robKey = "5a8ebda021926a35d9ffb5aadc69ebc9"
const davidName = "dvdshortland"
const robName = "Robertcarter24"

const imageAccessKey = "02zsWW31VU6zkTIi3nFExUtMjdh3lV0VXRVz3FG0xGE"
const imageSecretKey = "c9RmV4hheX4Z6DlFVNDwzGooZ-SBPEwB3nutJF_rnuo"

const fetchArtistImage = async (artist) => {
  const res = await axios.get(encodeURI(`https://api.unsplash.com/search/photos?page=1&query=${artist}&client_id=${imageAccessKey}`))
  const data = await res.data.results[0]
  return data
}

const fetchTrack = async () => {
  const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${robName}&api_key=${robKey}&format=json&limit=1`);
  const data = await res.data;
  return data;
}

const fetchTopArtists = async () => {
  const res = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${robName}&api_key=${robKey}&format=json&limit=5`)
  const data = await res.data;
  return data;
}

const getTopArtists = async () => {
  const d = await fetchTopArtists()
  topArtistData = d
}
getTopArtists()
setInterval(async () => {
  await getTopArtists()
}, 3600000);

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

app.get('/api/topArtistsData.json', async (req, res) => {
  res.json(topArtistData)
})

const routes = ['/','/portfolio','crypto']

app.get('/*', async (req, res) => {
  // res.sendFile(path.join(__dirname, 'build', 'index.html'));
  res.sendFile('index.html', { root });
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
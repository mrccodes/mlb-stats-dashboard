const express = require('express');
const app = express();
const cors = require('cors');
const moment = require('moment');
const { default: axios } = require('axios');

const HOST = 'http://localhost';

const NODE_SERVER_PORT = 3001;
const VITE_PORT = 3000;

var corsOptions = {
  origin: `${HOST}:${VITE_PORT}`,
};

app.use(cors(corsOptions));

app.get('/splash-hits', async (req, res) => {
  const url = 'https://www.mlb.com/giants/ballpark/splash-hits';
  const axiosRes = await axios.get(url);
  const reSection =
    /View All Giants Splash Hits([\s\S]*?)Other Home Runs into McCovey Cove/g;
  const section = [...axiosRes.data.matchAll(reSection)][0][0];
  const rePTags = /<p>(.*?)<\/p>/g;
  const splashHits = [...section.matchAll(rePTags)].map((match) => match[1]);
  const allSplashHits = splashHits.map((h) => {
    const words = h.split(' ');

    const number = parseInt(words[0], 10);
    const dateIndex = words.findIndex((word) => word.includes('/'));

    const batter = {
      firstName: words[1],
      lastName: words.slice(2, dateIndex).join(' '),
    };

    const splitDate = words[dateIndex].split('/');
    let month =
      splitDate[0].length === 2 ? splitDate[0] : splitDate[0].padStart(2, 0);
    let day =
      splitDate[1].length === 2 ? splitDate[1] : splitDate[1].padStart(2, 0);
    let year = splitDate[2].length === 4 ? splitDate[2] : '20' + splitDate[2];
    const normalizedDate = `${month}/${day}/${year}`;

    const date = moment(normalizedDate, 'MM/DD/YYYY');
    const opponent = words[dateIndex + 1];

    const pitcher = {
      firstName: words.slice(dateIndex + 2, dateIndex + 3).join(' '),
      lastName: words.slice(dateIndex + 3, words.length).join(' '),
    };

    return {
      batter,
      pitcher,
      number,
      date,
      opponent,
    };
  });

  res.send({
    total: splashHits.length,
    list: allSplashHits,
  });
});

app.listen(NODE_SERVER_PORT, () => {
  console.log(`Node server listening on port ${NODE_SERVER_PORT}`);
});

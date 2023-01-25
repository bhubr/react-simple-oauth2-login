const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');

const { port, oauth } = require('./settings');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5174',
  })
);

app.post('/spotify/token', (req, res) => {
  const { code } = req.body;
  const { tokenUrl, clientId, clientSecret, redirectUri } = oauth;
  // Spotify requires us to send client id and client secret, in base64, as authorization header
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );
  // Spotify wants url-encoded body (not including client id&secret)
  const payload = qs.stringify({
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  axios
    .post(tokenUrl, payload, {
      headers: {
        authorization: `Basic ${authString}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
    .then((resp) => resp.data)
    .then((data) => res.json(data))
    .catch((err) => {
      console.error('Error while requesting a token', err.response.data);
      res.status(500).json({
        error: err.message,
      });
    });
});

app.post('/github/token', (req, res) => {
  const { code } = req.body;
  const { tokenUrl, clientId, clientSecret, redirectUri } = oauth;
  // GitHub wants everything in an url-encoded body
  const payload = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  axios
    .post(tokenUrl, payload, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
    // GitHub sends back the response as an url-encoded string
    .then((resp) => qs.parse(resp.data))
    .then((data) => res.json(data))
    .catch((err) => {
      console.error('Error while requesting a token', err.response.data);
      res.status(500).json({
        error: err.message,
      });
    });
});

app.listen(port, (err) => {
  if (err) {
    console.error('>> ERROR! Something wrong happened', err);
  } else {
    console.log(`>> Server listening on port ${port}`);
  }
});

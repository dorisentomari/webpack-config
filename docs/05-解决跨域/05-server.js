const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../../webpack.config');

let compiler = webpack(config);

let app = express();
const PORT = 3000;
app.use(webpackDevMiddleware(compiler));

app.get('/user', (req, res) => {
  res.json({name: 'carl'});
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`the server is running at http://localhost:${PORT}`);
  }
});

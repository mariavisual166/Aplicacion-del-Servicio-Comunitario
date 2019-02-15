const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const app = express();

app.use(session({
  /*name: 'session',
  keys: ['key1', 'key2', 'desco', 'vida'],*/
  name: 'session',
  keys: ['key1', 'key2', 'desco', 'vida','CBuc7rr@'],
  cookie: {
    //secure: true,
    httpOnly: true,
    //domain: '',
    //path: '',
    maxAge: 60*60*1000,
  }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(express.static('./dist'));

app.use(require('./routes.js'));

let port = process.env.PORT || 80;

app.listen(port, () => console.log('escuchando en puerto '+ port));

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./server/schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { Nuxt, Builder } = require('nuxt');
// create app instance
const app = express();
// user Sessions
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// allow cross-origin requests
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// support json encoded bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// connect to mlab database
// make sure to replace my db string & creds with your own
mongoose.connect('mongodb://kamaleddin:aka12345@ds231941.mlab.com:31941/meduim', {
    useNewUrlParser: true
});
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.post('/sign', function(req, res) {
  req.session.token = req.body.token;
  req.session.save();
});

app.post('/login', function(req, res) {
  req.session.token = req.body.token;
  console.log(req.session);  
  req.session.save();
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/signIn');
});

// Production 
const isProd = (process.env.NODE_ENV === 'production');
// Nuxt config
const config = require('./nuxt.config.js');
const nuxt = new Nuxt(config);
// set that we are in development mode
config.dev = !isProd
// Render every route with Nuxt.jsyes
app.use(nuxt.render)
// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
  .then(listen)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
}

function listen() {
  let port = 3000;
  // Listen the server
  app.listen(port)
  console.log('Server listening on `localhost:' + port + '`.')
}
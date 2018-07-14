const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router/index')

const app = express();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// allow cross-origin requests
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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

app.post('/sign', urlencodedParser, (req, res) => {
  console.log(req.body);
});

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
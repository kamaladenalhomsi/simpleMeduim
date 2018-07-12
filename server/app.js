const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// allow cross-origin requests
app.use(cors());

// connect to mlab database
// make sure to replace my db string & creds with your own
mongoose.connect('mongodb://kamaleddin:aka12345@ds231941.mlab.com:31941/meduim', {
    useNewUrlParser: true
});
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.post((req, res, next) => {
  if (req.body) {
    let token = req.body.token
    req.session.token = token
    res.json({
      token,
      message: 'success'
    })
  }
})

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
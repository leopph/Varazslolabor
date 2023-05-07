const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const localStrategy = require('passport-local').Strategy;
const cors = require('cors');

const app = express();

const dbUrl = 'mongodb://localhost:27017';

mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => {
  console.log('Connected to database.');
});

mongoose.connection.on('error', (error) => {
  console.log('Failed to connect to database.', error);
});

require('./user.model');
require('./product.model');

const userModel = mongoose.model('user');

require('./boostrap')();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));
app.use(cors());

passport.use('local', new localStrategy((username, password, done) => {
  userModel.findOne({username: username}).then((user) => {
    if (!user) {
      return done("Couldn't find user with the specified name.");
    }

    user.comparePasswords(password, (error, isMatch) => {
      if (error) {
        return done("Couldn't compare user passwords. " + error);
      }

      return done(null, isMatch);
    });
  }, () => {
    return done("Failed to query user database.");
  });
}));

passport.serializeUser((user, done) => {
  if (!user) {
    return done('No user found to serialize.');
  }

  return done(null, user);
});

passport.deserializeUser((id, done) => {
  if (!id) {
    return done('No user id found to deserialize.');
  }

  return done(null, id);
});

app.use(expressSession({ secret: 'prf2021lassananodejsvegereerunk', resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('', express.static('public'));

app.use('/users', require('./userRoutes'));
app.use('/products', require('./productRoutes'));

app.use((_, res) => {
  res.status(404).send('Not found.');
})

app.listen(3000, () => {
  console.log('The server is running.');
})

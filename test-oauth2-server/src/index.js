const express = require('express');
const passport = require('passport');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const { Strategy: LocalStrategy } = require('passport-local');
const morgan = require('morgan');
const router = require('./routes');
const User = require('./models/user');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
  resave: false,
  secret: 'dummy-secret',
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
app.set('view engine', 'ejs');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  (email, password, done) => {
    console.log(email, password)
    User.findOne({ email }, (err, user) => {
      console.log(email, password)
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`OAuth2 server listening on port ${port}`)
});

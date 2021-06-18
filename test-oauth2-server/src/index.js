const express = require('express');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const { Strategy: LocalStrategy } = require('passport-local');
const morgan = require('morgan');
const router = require('./routes');
const User = require('./models/user');
const oauthServer = require('./middlewares/oauth-server');

const app = express();

app.oauth = oauthServer;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
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
  async (email, password, done) => {
    User.findOneByEmail(email)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  },
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);
  res.render('error', { error: err });
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error.stack);
  process.exit(1);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`OAuth2 server listening on port ${port}`);
});

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 3000;
const api = require('./api');
const session = require('express-session');
const passport = require('passport');
require('../secrets');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleConfig = {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
   session({
      secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
      resave: false,
      saveUninitialized: false,
   }),
);
app.use(passport.initialize());
app.use(passport.session());

const strategy = new GoogleStrategy(googleConfig, function(
   token,
   refreshToken,
   profile,
   done,
) {
   const googleId = profile.id;
   const name = profile.displayName;
   const email = profile.emails[0].value;

   User.findOne({ where: { googleId: googleId } })
      .then(function(user) {
         if (!user) {
            return User.create({ name, email, googleId }).then(function(user) {
               done(null, user);
            });
         } else {
            done(null, user);
         }
      })
      .catch(done);
});

// register our strategy with passport
passport.use(strategy);

passport.serializeUser((user, done) => {
   try {
      done(null, user.id);
   } catch (err) {
      done(err);
   }
});

passport.deserializeUser((id, done) => {
   User.findById(id)
      .then(user => done(null, user))
      .catch(done);
});

app.get('/auth/google', passport.authenticate('google', { scope: 'email' }));
app.get(
   '/auth/google/callback',
   passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login',
   }),
);

app.use('/api', api);

app.get('*', (req, res, next) => {
   res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

// To sync database, import db from db.js then:
// db.sync()  // sync our database
//   .then(function(){
//     app.listen(port) // then start listening with our express server once we have synced
//   })

app.listen(port, () => {
   console.log('Server is listening on port ' + port);
});

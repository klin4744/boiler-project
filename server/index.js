const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 3000;
const api = require('./api');
const session = require('express-session');
const passport = require('passport');

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

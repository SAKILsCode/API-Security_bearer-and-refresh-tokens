const jwt = require('jsonwebtoken');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('./User');

// Passport is definitely not that good option :|

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decode = jwt.verify(token, 'JWT_STRONG_SECRET');
      const user = await User.findById(decode._id);

      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } // catch block is not working
    catch (e) {
      done(e);
    }
  })
);

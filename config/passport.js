const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require("../config");
const UserModal = require('../models/user.modal').UserModal;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = () => {
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))
  
  

  var jwt_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('JWT'),
    secretOrKey: process.env.JWT_SECRET
  }
  passport.use('jwt-login', new JwtStrategy(jwt_options, async (payload, done) => {
      try {
        
        user = await UserModal.findById(payload._id);
        if (!user) {
          return done(null, false, { message: 'Invalid User, Doesnot Exists!' });
        }
      } catch (err) {
        console.log('Passport JWT Strategy Error',err);
        return done(err);
      }
      return done(null, user);
    })
  )
  
}


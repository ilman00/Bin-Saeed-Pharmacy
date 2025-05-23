const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

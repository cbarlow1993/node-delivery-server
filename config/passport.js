// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var request         = require('sync-request');
var Jira            = require('../config/jira');
var StringDecoder   = require('string_decoder').StringDecoder;
var decoder         = new StringDecoder('utf8');
// load up the user model
var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user)
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // Make request to Jira
        var response = request("POST", Jira.jiraHost + "/rest/auth/1/session", {json: {username: email, password: password } } )

        if (response.statusCode === 200) {
            var x = JSON.parse(decoder.write(response.body));
            return done(null, {email : email, password : password })
        } else {    
            return done(null, false, req.flash('loginMessage', 'Incorrect Username/Password'))
        }

    }));

};

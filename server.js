// server.js

// set up ======================================================================
// get all the tools we need
var express      = require('express');
var path         = require('path');
var app          = express();
var port         = process.env.PORT || 3000;
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var passport     = require('passport');
var flash        = require('connect-flash');
// Test
var http         = require('http');
var server       = http.createServer(app);
var io           = require('socket.io').listen(server);


// configuration ===============================================================
var configDB     = require('./config/database.js');
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: '1nkjd1n23n12ie12i3n12nei' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log('Error is: ' + err)
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
                pageTitle: 'Error',
                error: {
                    code: err.status || 500,
                    message: err.message
                }
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      console.log(err.message);
    });
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})
// launch ======================================================================

server.listen(port)

console.log('The magic happens on port ' + port);
var PythonShell = require('python-shell');
var config      = require('../config/config');




// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('pages/index.ejs', {
            pageTitle: 'Index',
            user: req.user
        }); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('pages/login.ejs', {
            pageTitle: 'Login',
            message: req.flash('loginMessage'),
            user: req.user
        });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('pages/profile.ejs', {
            pageTitle: 'Profile',
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    
    
    app.get('/test', isLoggedIn, function(req, res) {
    
        res.render('pages/test', {
            pageTitle: 'Test',
            user: req.user
        });
    });
    
    app.post('/test', isLoggedIn, function(req, res) {
        
         var options = {
          mode: 'text',
          pythonPath: config.pythonPath,
          pythonOptions: ['-u'],
          scriptPath: config.pythonScriptsDirectory,
          args: ['value1', 'value2', 'value3']
        };
        
        var pyshell = new PythonShell('printRange.py', options);
        
        pyshell.on('message', function (message) {
          console.log(message);
        });
        
        res.sendStatus(200)
    });
    
    
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

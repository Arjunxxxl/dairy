var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var MilkSub = require('../models/milk');

// Get Homepage
// Get Homepage
router.get('/regester', function(req, res){
	res.render('register');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/home', function(req, res){
	res.render('desicowmilk');
});

router.get('/dashboard', ensureAuthenticated,function(req, res){
	res.render('dashboard');
});


//sending mails watch liked video
router.post('/email', ensureAuthenticated,function(req, res){
	var query = req.body.query;
	var mobile= req.body.mobile;
	var name= req.body.name;
	req.checkBody('name','your name is required').notEmpty();
	req.checkBody('query','your query is required').notEmpty();
	req.checkBody('mobile','mobile number is required').notEmpty();
	var error = req.validationErrors();
	if(error){
		console.log(error);
		res.render('dashboard',{
			errors:error
		});
	}else{
		console.log(' no errors');
			var transporter = nodemailer.createTransport({
  				service: 'gmail',
    			port: 465,
    			secure: true,
  				auth: {
						user: 'a.asankhala@gmail.com',
							pass: '20@mix28'
  							}
								});

		var mailOptions = {
					   from: 'a.asankhala@gmail.com',
					   to: 'a.asankhala@gmail.com',
					   subject: mobile+" "+name,
					   text: query
					};

			transporter.sendMail(mailOptions, function(error, info){
			  			if (error) {
			    						console.log(error);
											req.flash('error_msg', 'An error orrur while sending your query');
											res.render('dashboard');
			  							} else {
			    										console.log('Email sent: ' + info.response);
															req.flash('success_msg', 'Your message has been successfully sent. You will recieve our response within 24 hours');

															res.redirect('/users/dashboard');
			  											}
																							});

	}
});


//milk product
router.get('/milk', ensureAuthenticated,function(req, res){
	res.render('milk_produce');
});
router.get('/unsubscribe_milk', ensureAuthenticated,function(req, res){
	console.log(req.query.mobile);
	MilkSub.findOneAndRemove({mobile:req.query.mobile}).then(function(){
		req.flash('success_msg', 'unsubscribed milk');
		res.redirect('/users/dashboard');
	});

	/*req.flash('success_msg', 'unsubscribed milk');
	res.render('dashboard');*/
});

router.get('/curd', ensureAuthenticated,function(req, res){
	res.render('curd_produce');
});

router.get('/ghee', ensureAuthenticated,function(req, res){
	res.render('ghee_produce');
});

router.get('/mysubscription', ensureAuthenticated,function(req, res){
	MilkSub.findOne({mobile:req.query.mobile},function(err,data){
		if(err) throw err;
		console.log(data);
		res.render('sub',{data:data});
	});

	console.log(req.query.mobile);
});

router.get('/mysubscription_ghee', ensureAuthenticated,function(req, res){
		res.render('sub_ghee');
});

router.get('/mysubscription_curd', ensureAuthenticated,function(req, res){
		res.render('sub_curd');
});

router.get('/mysubscription_up', ensureAuthenticated,function(req, res){
		res.render('update');
});

router.get('/mysubscription_q', ensureAuthenticated,function(req, res){
		res.render('query');
});

//update data
router.post('/updateData', ensureAuthenticated,function(req, res){
	var data = req.body.up;
	var n = req.body.updateval;
	var old;

	if(data==='mobile'){
		MilkSub.findOneAndUpdate({mobile:req.query.mobile},{mobile:n}).then(function(){
			User.findOneAndUpdate({mobile:req.query.mobile},{mobile:n}).then(function(){
				req.flash('success_msg', 'Data updated');
				res.redirect('/users/mysubscription_up');
			});
		});
	}
	else if(data==='address'){
		MilkSub.findOneAndUpdate({address:req.query.address},{address:n}).then(function(){
			User.findOneAndUpdate({address:req.query.address},{address:n}).then(function(){
				req.flash('success_msg', 'Data updated');
				res.redirect('/users/mysubscription_up');
			});
		});
	}
	else {req.flash('error_msg', 'Invalide Input');
	res.redirect('/users/mysubscription_up'); 	}
});



// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var mobile = req.body.mobile;
	var password = req.body.password;
	var password2 = req.body.password2;
	var address = req.body.address;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('address','address is required').notEmpty();
	req.checkBody('mobile', 'Mobile number is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			address:address,
			mobile: mobile,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
				console.log(user.mobile);
   			return done(null, user);

   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/dashboard', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

	router.get('/logout', function(req, res){
		req.logout();

		req.flash('success_msg', 'You are logged out');

		res.redirect('/users/login');
	});


	function ensureAuthenticated(req, res, next){
		if(req.isAuthenticated()){
			return next();
		} else {
			//req.flash('error_msg','You are not logged in');
			res.redirect('/users/login');
		}
	}

	//save milk subscription
	router.post('/milk_sub', ensureAuthenticated, function(req, res){
		var name = req.body.nameo;
		var mobile = req.body.mobile;
		var address = req.body.address;
		var start = req.body.date;
		var duration = req.body.duration;
		var product = "milk";
		var amount;
		if(duration==="1 day"){amount="55"}
		else if(duration==="15 day"){amount="795"}
		else if(duration==="1 month"){amount="1500"}
		else {amount="error"}


	req.checkBody('nameo', 'Name is required').notEmpty();
	req.checkBody('mobile', 'Mobile number is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('date', 'Date is required').notEmpty();
	req.checkBody('duration', 'Duration is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('milk_produce',{
			errors:errors
		});
	}
		else{
			var newUser = new MilkSub({
				name: name,
				product:product,
				address:address,
				mobile: mobile,
				date: start,
				duration:duration,
				amount:amount,
				payment:'Pending'
			});

			MilkSub.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});

			req.flash('success_msg', 'Successfully subscribe to milk produce. You can view your subscription in "My subscription" tab');

			res.redirect('/users/milk');
		}
});


//sending mails watch liked video
router.post('/email/u', ensureAuthenticated,function(req, res){
	var query = req.body.q;
	var mobile= req.body.mobile;
	var name= req.body.name;
	req.checkBody('name','your name is required').notEmpty();
	req.checkBody('q','your query is required').notEmpty();
	req.checkBody('mobile','mobile number is required').notEmpty();
	var error = req.validationErrors();
	if(error){
		console.log(error);
		res.render('query',{
			errors:error
		});
	}else{
		console.log(' no errors');
			var transporter = nodemailer.createTransport({
  				service: 'gmail',
    			port: 465,
    			secure: true,
  				auth: {
						user: 'a.asankhala@gmail.com',
							pass: '20@mix28'
  							}
								});

		var mailOptions = {
					   from: 'a.asankhala@gmail.com',
					   to: 'a.asankhala@gmail.com',
					   subject: mobile+" "+name,
					   text: query
					};

			transporter.sendMail(mailOptions, function(error, info){
			  			if (error) {
			    						console.log(error);
											req.flash('error_msg', 'An error orrur while sending your query');
											res.render('dashboard');
			  							} else {
			    										console.log('Email sent: ' + info.response);
															req.flash('success_msg', 'Your message has been successfully sent. You will recieve our response within 24 hours');

															res.redirect('/users/mysubscription_q');
			  											}
																							});

	}
});


module.exports = router;

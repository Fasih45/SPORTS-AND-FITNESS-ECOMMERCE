


// router
const router = require('express').Router()

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
var connection = require('../database.js');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
// use routers
// router.get('/a', (req, res) => {
//     res.send('Hello World!')
//   })
  // view engine setup

  router.use(logger('dev'));

  router.use(cookieParser());

 
  router.use(session({ 
    secret: '123458cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
router.use(flash());
 
// sendEmailforpass


function sendEmailforpass(email, token) {
    console.log('yes')
    
    let email2 = email;
    let pass =  token.concat("jasdhkja1232");
    let mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    
        user: 'fzmstore45@gmail.com',
        pass: 'festpifwteyrpdng'
    
    }
    });
    let mailOptions = {
    from: 'fzmstore45@gmail.com',
    to: email2,
    subject: 'Email verification - Tutsmake.com',
    html: '<p>You requested for pass reset, kindly use this <a href="http://localhost:3000/email/verify-userpassword?token=' + pass + '">link</a> to verify your email address</p>'
    };
    mail.sendMail(mailOptions, function(error, info) {
    if (error) {
    return 1
    } else {
    return 0
    }
    });
    }



function sendEmail(email, token) {
    console.log('yes')
    
    var email = email;
    var token = token;
    var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    
        user: 'fzmstore45@gmail.com',
        pass: 'festpifwteyrpdng'
    
    }
    });
    var mailOptions = {
    from: 'fzmstore45@gmail.com',
    to: email,
    subject: 'Email verification - Tutsmake.com',
    html: '<p>You requested for email verification, kindly use this <a href="http://localhost:3000/email/verify-email?token=' + token + '">link</a> to verify your email address</p>'
    };
    mail.sendMail(mailOptions, function(error, info) {
    if (error) {
    return 1
    } else {
    return 0
    }
    });
    }
    /* home page */
    router.get('/emailindex', function(req, res, next) {
    res.render('emailcheckvari', {
    title: 'Express'
    });
    });
//  forget route
router.get('/forgetpass', function(req, res, next) {
    res.render('forget', {
    title: 'Express'
    
    });
    });




    /* send verification link */
    router.post('/send-email', function(req, res, next) {
        let x=10;
 
    var email = req.body.email;
    console.log(email);
   
    connection.query('SELECT * FROM users WHERE email ="' + email + '"', function(err, result) {
    if (err) throw err;
    var type = 'success'
    var msg = 'Email already verified'
    console.log(result[0]);
    
    if (result.length > 0 ) {
    var token = randtoken.generate(20);
    if(result[0].verify == 0 ){
    var sent = sendEmail(result[0].email, token);
    if (sent != '0') {
    var data = {
    token: token
    }
    connection.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function(err, result) {
    if(err) throw err
    })
    type = 'success';
    msg = 'The verification link has been sent to your email address';
    } else {
    type = 'error';
    msg = 'Something goes to wrong. Please try again';
    }
    x=0;
    }
    } else {
        x=0;
    console.log('1');
    type = 'error';
    msg = 'This User is not registered with us';
    }
    if(x==10){ 

        res.redirect('/user/login');
    }
    else{
        req.flash(type, msg);
        res.redirect('/email/emailindex');
    }
 
    });
    })



     /* send verification link  for pass */
     router.post('/send-pass', function(req, res, next) {
        let x=10;
 
    let email = req.body.email;
    console.log(email);
   
    connection.query('SELECT * FROM users WHERE email ="' + email + '"', function(err, result) {
    if (err) throw err;
    var type = 'success'
    var msg = 'Email already verified'
    console.log(result[0]);
    
    if (result.length > 0 ) {
    // var token = randtoken.generate(20);

    if(result[0].verify == 1 ){
    let sent = sendEmailforpass(result[0].email,result[0].username );
    if (sent != '0') {
   
    type = 'success';
    msg = 'The verification link has been sent to your email address';
    } else {
    type = 'error';
    msg = 'Something goes to wrong. Please try again';
    }
    x=0;
    }
    } else {
        x=0;
    console.log('1');
    type = 'error';
    msg = 'This User is not registered with us';
    }
    if(x==10){ 
        type = 'error';
        msg = 'This Email is not verified ! ';
        req.flash(type, msg);
        res.redirect('/email/forgetpass');
    }
    else{
        req.flash(type, msg);
        res.redirect('/email/forgetpass');
    }
 
    });
    })
    /* verification email link */
    router.get('/verify-email', function(req, res, next) {

    connection.query('SELECT * FROM users WHERE token ="' + req.query.token + '"', function(err, result) {
    if (err) throw err;
    var type
    var msg
    if(result[0]){///to handle undifiend
        if(result[0].verify == 0)
        {
        if (result.length > 0) {
        var data = {
        verify: 1
        }
        connection.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function(err, result) {
        if(err) throw err
        })
        type = 'success';
        msg = 'Your email has been verified';
        } else {
        console.log('0');
        type = 'success';
        msg = 'The email has already verified';
        }
        }
        
        else{
            console.log('00');
        type = 'error';
        msg = 'The email has been already verified';
        }
    
        req.flash(type, msg);
        res.redirect('/user/login');
       
    }

    else{
        res.send('<h1>No connection allowed !</h1>');

    }
   



  
    });
    })
    
    
   
    
     /* verification email link */
     router.get('/verify-userpassword', function(req, res, next) {

       let user = (req.query.token  + "jasdhkja1232").split("jasdhkja1232").reverse().join('');
        connection.query('SELECT * FROM users WHERE username ="' + user+ '"', function(err, result) {
        if (err) throw err;
        console.log(result[0]);

        if(result[0]){///to handle undifiend
            res.render('resetpass', {
                title: 'Express',
                token:user
                });
        }

        else{
            res.send('<h1>No connection allowed !</h1>');

        }
       

        });
        })
        
        
       
        
    
 
  
  
  
module.exports = router
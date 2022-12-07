// import controllers review, products
const usercontroller= require('../controllers/productController.js')

// router
const router = require('express').Router()
const bcrypt = require("bcrypt");
const mysql = require('mysql')
const bodyparser = require('body-parser')
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({
    extended: true
}))


// Database connection
const db1 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project1"
})

db1.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

var sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema:{
        tableName: 'sessiontbl',
        columnNames:{
            session_id: 'sesssion_id',
            expires: 'expires',
            data: 'data'
        }
    }
},db1)

router.use( session({
    key: 'keyin',
    secret: 'my secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

// use routers
// router.get('/a', (req, res) => {
//     res.send('Hello World!')
//   })
  


  router.get('/register', usercontroller.signup )
  router.post('/signup/check',usercontroller.signupcheck)
  router.get('/login', usercontroller.login )
  router.post('/login/check',usercontroller.checklogin)
  router.post('/updatepass',usercontroller.updatepass)

  
  
module.exports = router
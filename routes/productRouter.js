// import controllers review, products
const productController = require('../controllers/productController.js')


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



  router.get('/a', productController.registerproduct)
  router.post('/uploadproduct', productController.upload ,productController.uploadp)
  router.get('/allProducts', productController.getAllProducts)
  router.get('/adminallProducts', productController.getAllProductsadmin)
  router.get('/adminorderdetail', productController.adminorderdetail)
  router.get('/updatep/:id', productController.updateProduct)
  router.post('/updatedone/:id', productController.upload ,productController.updateProductdone)
  router.get('/deletep/:id', productController.deleteProduct)
  router.post('/se', productController. getOneProduct )
  router.post('/adminse', productController.getOneProductadmin)
   
  router.get('/detail/:id', productController.getOnecomments)
  router.get('/detailadmin/:id', productController.admingetOnecomments)
  router.post('/detail/process', productController.commentlog)
  router.post("/requestrating",productController.ratingset)
  router.get('/logoutuser', function(req,res){
    req.session.userin=null;
    res.redirect('/user/login')
})

router.get('/logoutadmin', function(req,res){
    req.session.admin=null;
    res.redirect('/user/admin')
})


router.post('/processcart',productController.processcart)
router.get('/cart', productController.getcart)
router.get('/updatecart/:id/:q/:t',productController.updatecart) //for query also use get
router.get('/completeorder/:oid/:grand', productController.completeorder)
router.get('/fullorder/:id', productController.fullorder)
router.get('/userdetails', productController.userdetails)

module.exports = router
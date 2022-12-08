const db = require('../models')

// image Upload
const multer = require('multer')
const path = require('path')
const { USER } = require('../config/dbConfig')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const router = require('../routes/emailRouter');
const MySQLStore = require("express-mysql-session")(session);
const mysql = require('mysql')
const bodyparser = require('body-parser')
let sendx=0;
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({
    extended: true
}))
// create main Model
const Product = db.products
const User = db.users
const Comments=db.comments
const Rating=db.rating;
const Cart=db.cartorders
const Order=db.orders

// Database connection





// const Review = db.reviews

// main work


//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
   

}).single('image')


// 1. create product


const registerproduct = async (req, res) => {
    if(req.session.admin){
        res.sendFile(__dirname + '/index.html');
    }
    
    else{
    
        res.redirect('/user/admin')
    }

    
  

}

const uploadp = async (req, res) => {


    if(req.session.admin){    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)

        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename

        if(req.body.quantity1<1){
            req.body.quantity1=0;

        }
        let info = {
            file_src: imgsrc,
            title: req.body.id,
            price: req.body.price1
            ,quantity:req.body.quantity1,
            desc:req.body.texta
            
            
        }
        const product = await Product.create(info)
        res.redirect('/adminallProducts');
        console.log(product)
       
        
       
        
    }
}
    
    else{
    
        res.redirect('/user/admin')
    }
    

}





const resultsPerPage=3;

// 2. get all products
var ordermessage="";
const getAllProducts = async (req, res) => {

if(req.session.userin){
    let products = await Product.findAll({})
if(products.length >0){
    const numOfResults = products.length;
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if(page > numberOfPages){
        res.redirect('/?page='+encodeURIComponent(numberOfPages));
    }else if(page < 1){
        res.redirect('/?page='+encodeURIComponent('1'));
    }

     
            //Determine the SQL LIMIT starting number
         
            const startingLimit = (page - 1) * resultsPerPage;
           
            //Get the relevant number of POSTS for this starting page
            
            let products2 = await Product.findAll({offset:startingLimit , limit: resultsPerPage})
          
                let iterator = (page - 5) < 1 ? 1 : page - 5;
                let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                if(endingLink < (page + 0)){
                    iterator -= (page + 1) - numberOfPages;
                }
                res.render('mainviewuser', {users: products2, page, iterator, endingLink, numberOfPages ,title:'all products' ,  layout:'./layouts/layoutmain2' ,message:ordermessage});

ordermessage="";
}      
else{
    res.redirect('/a');
}   


}

else{

    res.redirect('/user/login')
}
   

}


/////admin all products

const getAllProductsadmin= async (req, res) => {

    if(req.session.admin){
        let products = await Product.findAll({})
    if(products.length >0){
        const numOfResults = products.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if(page > numberOfPages){
            res.redirect('/?page='+encodeURIComponent(numberOfPages));
        }else if(page < 1){
            res.redirect('/?page='+encodeURIComponent('1'));
        }
    
         
                //Determine the SQL LIMIT starting number
             
                const startingLimit = (page - 1) * resultsPerPage;
               
                //Get the relevant number of POSTS for this starting page
                
                let products2 = await Product.findAll({offset:startingLimit , limit: resultsPerPage})
              
                    let iterator = (page - 5) < 1 ? 1 : page - 5;
                    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
                    if(endingLink < (page + 0)){
                        iterator -= (page + 1) - numberOfPages;
                    }
                    res.render('mainview', {users: products2, page, iterator, endingLink, numberOfPages ,title:'all products'  });
    
    
    }      
    else{
        res.redirect('/a');
    }   
    
    
    }
    
    else{
    
        res.redirect('/user/admin')
    }
       
    
    }




// // 3. get single product

const getOneProduct = async (req, res) => {

    let id = req.body.id
    let product = await Product.findAll({ where: { title: id }})
    // res.status(200).send(product)

   res.render('search', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : product,
            layout:'./layouts/layoutmain2'
        }
        );
}


//for admin


const getOneProductadmin = async (req, res) => {

    let id = req.body.id
    let product = await Product.findAll({ where: { title: id }})
    // res.status(200).send(product)

   res.render('adminsearch', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : product,

        }
        );
}

let messageforcart="";
///commnts
const getOnecomments = async (req, res) => {

    let id = req.params.id
    let product = await Comments.findAll({ where: { title: id },order: [
        ['id', 'DESC'],
        
    ]})
    let x= await Product.findAll({ where: { title: id }})
    // res.status(200).send(product[0])
  

   res.render('description', {
            title : 'desc',
            users : product,
            id:id,
            rate:x,
            message:messageforcart,
            layout:'./layouts/layoutmain2'
            
        }
        );
        messageforcart="";


}

const admingetOnecomments = async (req, res) => {

    let id = req.params.id
    let product = await Comments.findAll({ where: { title: id },order: [
        ['id', 'DESC'],
        
    ]})
    let x= await Product.findAll({ where: { title: id }})
    // res.status(200).send(product[0])
  

   res.render('descriptionadmin', {
            title : 'desc',
            users : product,
            id:id,
            rate:x,
            
            
            
        }
        );
        messageforcart="";


}









const commentlog = async (req, res) => {



    let id = req.body.text1
    let pd=req.query.token 
   
       let info = {
        title: pd,
        user: req.session.userin,
        comments: id
        
    }
    const product = await Comments.create(info)
   
    console.log(product)

    res.redirect('/detail/'+ pd)
    

}

////rating set

const ratingset = async (req, res) => {
let product=0;
    let user = await Rating.findAll({ where: { user: req.session.userin,title: req.query.token }})
    
   let rate=req.body.rating
   let pd=req.query.token 
   
       let info = {
        title: pd,
        user: req.session.userin,
        rate: rate
        
    }

    if(user.length <1){
         product = await Rating.create(info)
    }
   else{
    product = await Rating.update(info,{ where: { user: req.session.userin,title: req.query.token }})
   
   }
   
let overall= await Rating.findAll({ where: { title: req.query.token }})
if(overall.length!=0){
let sum=0;
    overall.forEach(function(user){
     sum=sum+user.rate;


    })

    console.log(sum/overall.length);
    let totallrate=sum/overall.length;

    let info2 = {
        rating:totallrate
        
        
    }

    const product = await Product.update(info2, { where: { title:req.query.token  }})


}
    console.log(product)

    res.redirect('/detail/'+ pd)
    

}


// // 4. update Product



const updateProduct = async (req, res) => {

    if(req.session.admin){
        let id = req.params.id
   
        let product = await Product.findOne({ where: { id: id }})
       
   
        res.render('edit', {
           title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
           user : product,
           layout:'./layouts/layoutmain3'
       });
    }
    
    else{
    
        res.redirect('/user/admin')
    }


 

   

}


const updateProductdone = async (req, res) => {
    let id = req.params.id
    
    var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename

    if(req.body.quantity1<1){
        req.body.quantity1=0;}




    let info = {
        file_src: imgsrc,
        title: req.body.id,
        price: req.body.price1
        ,quantity:req.body.quantity1,
        desc:req.body.texta
        
    }

    const product = await Product.update(info, { where: { id: id }})

    res.redirect('/adminallProducts');
   

}

// 5. delete product by id

const deleteProduct = async (req, res) => {

    let id = req.params.id
    
    await Product.destroy({ where: { id: id }} )

    res.redirect('/adminallProducts');

}


////user signup
const signup = async (req, res) => {
    res.render('signup', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
        message:'',
     layout:'./layouts/layoutmain3'
    }
    );

}

// /signup/check

const signupcheck = async (req, res) => {


    let id = req.body.username
    let user = await User.findAll({ where: { username: id }})
    let emailc= await User.findAll({ where: { email:req.body.useremail  }})
    // res.status(200).send(product)

 


    
   if(user.length ==0 ){
    if(emailc.length ==0 ){
        const password1 = req.body.userpass;
  
        bcrypt.hash(password1, saltRounds, async (err, hash) => {
          if (err) {
            console.log(err);
          }
          

          let info = {
            username:req.body.username,
            email: req.body.useremail,
            password: hash,
            Ph:req.body.ph,
            address:req.body.address
            
        }
             user = await User.create(info)
             res.redirect('/user/login')
      
    });
   

   
   
    }

else{

  res.render('signup', {
    title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
    message:'This email has already been Registered',
 layout:'./layouts/layoutmain2'
}
);
}
   
   }
   else {
    res.render('signup', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
        message:'This username has already been Registered',
     layout:'./layouts/layoutmain2'
    }
    );

   }

}
const login = async (req, res) => {
    res.render('emailvari', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
        message:'',
        layout:'./layouts/layoutmain3'
     
    }
    );

}
const checklogin = async (req, res) => {


    const username = req.body.username1;
     const password = req.body.pass1;

     let user = await User.findAll({ where: { username: username }})
     console.log(user);

     if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (error, response) => {
          if (response) {
           
            if(user[0].verify !='1'){
                res.redirect('/email/emailindex')
            }else{
                req.session.userin=username;
                res.redirect('/allProducts')
            }
           
          } else {
           
            res.render('emailvari',{title:"yes " , message: "Wrong username/password combination!",layout:'./layouts/layoutmain3' });
          }
        });
      } 
      
      
      else {
        res.render('emailvari',{title:"yes " , message: "User doesn't exist",layout:'./layouts/layoutmain3' });
        
      }

 

     
    

}



const updatepass = async (req, res) => {

    let id = req.body.id


    bcrypt.hash(req.body.userpass, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        }
        

        let info = {
        
          password: hash,
         
          
      }
      const product = await User.update(info, { where: { username: id }})

      res.redirect('/user/login')
    
  });
   

}

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

const processcart = async (req, res) => {
    let quantity=req.body.quantity
    let pd=req.query.token 
    let product= await Product.findAll({ where: { title: req.query.token }})

    
if(quantity<1){
    messageforcart="plz select valid option < 1";
    res.redirect('/detail/'+ pd);

}
else if(product[0].quantity<quantity) {
    messageforcart="The quantity is out of stock range only "+product[0].quantity+' left' ;
    res.redirect('/detail/'+ pd);
}
else
{
    messageforcart="";
let checkproduct=await Cart.findAll({ where: {user: req.session.userin,title: req.query.token,orderid:0}})
let subtotal= quantity * product[0].price;
if(checkproduct.length<1){
   
let info = {
    user:req.session.userin,
    title:pd,
    quantity: quantity,
    subtotal:subtotal,
    file_src:product[0].file_src,
    priceeach:product[0].price
       
}
    let order = await Cart.create(info)
    res.redirect('/allProducts');
}    
else{
    let info = {
        
        quantity: Number(checkproduct[0].quantity)+Number(quantity) ,
        subtotal:subtotal+checkproduct[0].subtotal,
        
           
    }
    let order = await Cart.update(info, { where: {user: req.session.userin,title: req.query.token,orderid:0}})
    res.redirect('/allProducts');
        
}


let info = {
    
    quantity:Number(product[0].quantity)-Number(quantity),
    
    
}

 product = await Product.update(info, { where: { title: req.query.token}})
    
}

 

}
  
const getcart = async (req, res) => {

    if(req.session.userin){  let product= await Cart.findAll( { where: {user: req.session.userin,orderid:0}})
    let gtotall=0;
    product.forEach(function(p){

        gtotall= Number(p.subtotal)+Number(gtotall) 
    })
    
    res.render('cart', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
       product:product,
       orderid:between(100,10000),
       grand:gtotall
       ,layout:'./layouts/layoutmain2'
        
    }
    );}
  

    else{
        res.redirect('/allProducts');
    }
   

}

const updatecart= async (req, res) => {

    

    let product= await Product.findAll({ where: { title: req.params.t }})

    let info = {
    
        quantity:Number(product[0].quantity)+Number(req.params.q),
        
        
    }
    
     product = await Product.update(info, { where: { title: req.params.t }})

    
    
    await Cart.destroy({ where: { id: req.params.id }} )

    res.redirect('/cart');
   

}

const { createInvoice } = require("./createInvoice.js");
const completeorder= async (req, res) => {

    

  
    let info = {
    
       orderid:req.params.oid
        
        
    }
      await Cart.update(info,{ where: {user: req.session.userin,orderid:0}})

      info={
        orderid:req.params.oid,
        user:req.session.userin,
        grandtotal:req.params.grand
      }
      let order = await Order.create(info)

let user= await User.findAll({ where: { username:req.session.userin  }})
let product= await Cart.findAll( { where: {user: req.session.userin,orderid:req.params.oid}})
     
      const invoice = {
        shipping: {
          name: user[0].username,
          address: user[0].address,
          country: "Pakistan",
          state: "CA",
          postal_code: 94111
          
        },
        items:product 
        ,
        subtotal: req.params.grand,
        paid: 0,
        invoice_nr: req.params.oid
      };

      createInvoice(invoice,(''+req.params.oid+'.pdf'));
      console.log(product)
      res.redirect('/email/sendpdf/'+req.params.oid+"/"+user[0].email);
      ordermessage="order generated successfully recipt mail has bees sent";

}


const adminorderdetail= async (req, res) => {
    if(req.session.admin){
        let order= await Order.findAll()

        res.render('orderdeatails', {
            title : 'Details',
            order:order
            
        })
    }
    
    else{
    
        res.redirect('/user/admin')
    }


    
   


}


const fullorder= async (req, res) => {



    if(req.session.admin){
        let order= await Cart.findAll({ where: { orderid:req.params.id  }})

        res.render('fullorder', {
            title : 'Details',
            order:order
            
        })   
    }
    
    else{
    
        res.redirect('/user/admin')
    }
  


}
 const userdetails= async (req, res) => {


    if(req.session.admin){
        let user= await User.findAll()

    res.render('userdetails', {
        title : 'Details',
        user:user
        
    })

    
    }
    
    else{
    
        res.redirect('/user/admin')
    }
   

}

const adminlog =async (req, res) =>{
    res.render('adminlogin',{title:"admin" , message: "" ,layout:'./layouts/layoutmain3'});
}

const admin={
    user:'admin',
    password:'admin'
    
    
    };

const checkadmin =async (req, res) =>{
    const username = req.body.username1;
    const password = req.body.pass1;

    if(username != admin.user || password != admin.password){
        
        res.render('adminlogin',{title:"yes " , message: "Wrong Id or password",layout:'./layouts/layoutmain3' });
    }
    else{
        req.session.admin = username;
        res.redirect('/adminallProducts');
    }
}

// app.post("/admina/check", (req, res) => {
   

//   }


module.exports = {
    registerproduct,
    uploadp,upload,
    getAllProducts,
    updateProduct ,
    updateProductdone,
    deleteProduct,
    getOneProduct,
    signup  
    ,signupcheck,
    login,
    checklogin,
    updatepass
   ,getOnecomments,
   commentlog,
   ratingset,
   processcart
   ,getcart,updatecart,
   completeorder,
   getAllProductsadmin,
   adminorderdetail,
   fullorder,userdetails,adminlog,
   checkadmin,getOneProductadmin,
   admingetOnecomments
    // getAllProducts,
    // getOneProduct,
    // updateProduct,
    // deleteProduct,
    // getPublishedProduct,
    // getProductReviews,
    // upload
    
}
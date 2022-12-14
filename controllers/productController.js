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
    
    res.sendFile(__dirname + '/index.html');

}

const uploadp = async (req, res) => {
    
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)

        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
        let info = {
            file_src: imgsrc,
            title: req.body.id,
            price: req.body.price1
            
        }
        const product = await Product.create(info)
        res.redirect('/a');
        console.log(product)
       
        
       
        
    }

}





const resultsPerPage=3;

// 2. get all products

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
                res.render('mainview', {users: products2, page, iterator, endingLink, numberOfPages ,title:'yes'});


}      
else{
    res.redirect('/a');
}   


}

else{

    res.redirect('/user/login')
}
   

}




// // 3. get single product

const getOneProduct = async (req, res) => {

    let id = req.body.id
    let product = await Product.findAll({ where: { title: id }})
    // res.status(200).send(product)

   res.render('search', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : product
        }
        );
}

///commnts
const getOnecomments = async (req, res) => {

    let id = req.params.id
    let product = await Comments.findAll({ where: { title: id },order: [
        ['id', 'DESC'],
        
    ]})
    // res.status(200).send(product[0])
  

   res.render('description', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : product,
            id:id
        }
        );
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



// // 4. update Product



const updateProduct = async (req, res) => {

    let id = req.params.id
   
     let product = await Product.findOne({ where: { id: id }})
    

     res.render('edit', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
        user : product
    });

   

}


const updateProductdone = async (req, res) => {
    let id = req.params.id
    
    var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
    let info = {
        file_src: imgsrc,
        title: req.body.id,
        price: req.body.price1
        
    }

    const product = await Product.update(info, { where: { id: id }})

    res.status(200).send(product)
   

}

// 5. delete product by id

const deleteProduct = async (req, res) => {

    let id = req.params.id
    
    await Product.destroy({ where: { id: id }} )

    res.status(200).send('Product is deleted !')

}


////user signup
const signup = async (req, res) => {
    res.render('signup', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
        message:'',
     layout:'./layouts/layoutmain2'
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
            Ph:req.body.ph
            
        }
             user = await User.create(info)
            res.status(200).send(user)
            console.log(user)   
      
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
                res.send(req.session.userin)
            }
           
          } else {
           
            res.render('emailvari',{title:"yes " , message: "Wrong username/password combination!" });
          }
        });
      } 
      
      
      else {
        res.render('emailvari',{title:"yes " , message: "User doesn't exist" });
        
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
   commentlog
    // getAllProducts,
    // getOneProduct,
    // updateProduct,
    // deleteProduct,
    // getPublishedProduct,
    // getProductReviews,
    // upload
    
}
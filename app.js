const express = require('express')
const cors = require('cors')
const app = express()

const bodyparser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
const ejs = require('ejs');

var expressLayouts = require('express-ejs-layouts');
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);
const cheerio = require('cheerio');
const axios = require('axios');



app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.use(express.static("./public"))

app.set('view engine', 'ejs')
app.set('views', './src/views')


app.use(expressLayouts);
app.set('layout', './layouts/layoutmain')

// routers
const router = require('./routes/productRouter.js')
const router2 = require('./routes/loginRouter.js')
const router3 = require('./routes/emailRouter.js')

app.use('/', router)
app.use('/user', router2)
app.use('/email', router3)


app.get('/scrap',(req, res) => {


    const url = 'https://www.imdb.com/chart/top/?ref_=nv_mv_250';

    let product = [];
    axios.get(url).
    then((response) => {
    
        let $ = cheerio.load(response.data);
        $('.lister-list tr').each(function(el , index){
            let url = $(this).find('td.titleColumn a').attr('href');
            let title = $(this).find('td.titleColumn a').text();
            let rating = $(this).find('td.imdbRating').text();
            product.push({ title: title, rating: rating , url : url});
        });
        console.log(product);
    
    }).catch((error)=>{
        console.log(error);
    })
    

 
   
});




//port
const PORT = process.env.PORT || 3000

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
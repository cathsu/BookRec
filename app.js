const express = require("express");
const request = require('request');
const bodyParser = require("body-parser");
const _ = require('lodash');
const mysql = require('mysql');
const moment = require('moment');
const session = require('express-session');

const port = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const api_key = process.env.book_key;
const databaseUsername = process.env.user;
const databasePassword = process.env.pass;

const connection = mysql.createConnection({
    host: 'localhost',
    user: databaseUsername,
    password: databasePassword,
    database: 'bookrec_db'
});
connection.connect();

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(function (req, res, next) {
  res.locals.user = "false";
  req.session.username = "false";
  next();
});


///////////////////////////// HOME //////////////////////////////////
app.get("/", function(req, res){
    console.log(res.locals.user);   
    res.render("home.ejs");
});

app.post("/populateCards", function(req, res) {
    let statement =  'select * from featured_books';
    console.log(req.body.card1);
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        let cards = [];
	        let card1 = req.body.card1;
	        found.forEach(function(item, index){
	           if(item.title == card1){
    	           cards[0] = found[(index+1)%found.length];
    	           cards[1] = found[(index+2)%found.length];
    	           cards[2] = found[(index+3)%found.length];
	           }
	        });
	        console.log(cards);
            res.send(cards);
	    }//found.length
    });//connection
});//route


///////////////////////////// SIGN UP/LOGIN //////////////////////////////////
app.get("/signup", function(req, res){
    res.locals.user = req.session.username;
    res.render("signup.ejs");
});

app.get("/login", function(req, res){
    res.locals.user = req.session.username;
    res.render("login.ejs", {"invalid": false});
});

app.post('/loginSession', function(req, res){
    let statement = 'select * from users where username=\'' 
                    + req.body.username + '\' and password=\''
                    + req.body.password + '\';';
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        req.session.authenticated = true;
	       // req.session.user = req.body.username;
            req.session.username = req.body.username;
            res.locals.user = req.session.username;
            res.render("home.ejs");
	    } else {
            res.render("login.ejs", {"invalid": true});
        }//found.length
    });//connection
});//route



///////////////////////////// RESULTS //////////////////////////////////
app.get("/results", async function(req, res){
    res.locals.user = req.session.username;
    let params = getParameters(req); 
    let books = await getResults(params);
    res.render("results.ejs", {books: books});
});


// 
app.get("/results/:ISBN", async function(req, res){
    res.locals.user = req.session.username;
    let results = await getResults('q=isbn:'+req.params.ISBN);
    console.log(results);
    let book =  await getBookInfo(results.items[0]); 
    // console.log(JSON.stringify(book));
    console.log(book);
    let reviews = await getReviews(req.params.ISBN); 
    console.log(reviews);
    // console.log("username = " + req.session.username);
    let usersWhoLeftReviews = await checkUserReviews(req.params.ISBN, null); 
    let hasUserLeftReview = usersWhoLeftReviews.length > 0 ? true: false; 
    console.log("userLeftReview = " + hasUserLeftReview);
    res.render("singleResult.ejs", {book: book, ISBN: req.params.ISBN, moment:moment, reviews: reviews, user: null, hasUserLeftReview: hasUserLeftReview});
});

app.post("/addreview/:ISBN", function(req, res) {
    console.log(req.body.newReview);
    let datetime = moment().format(); 
    console.log(req.body);
    addReview(req, datetime);
    res.redirect("/results/" + req.params.ISBN); 
}); 


app.listen(process.env.PORT || port, function(){
    console.log("server is running...");
});


function getBookInfo(result) {
    let cover = "No image available"; 
    let title = "No title available";
    let authors = "No author available";
    let publisher = "No publisher available"; 
    let publishedDate = "No data available";
    let synopsis = "No synopsis available"; 
    let subjects = "No subject available"; 
    let pageCount = "No page count available"; 
    let isbn10 = "No ISBN_10 available"; 
    let isbn13 = "No ISBN_13 available";
    
    console.log("fine"); 
    let book = {
        cover: cover, 
        title: title, 
        authors: authors, 
        publisher: publisher, 
        publishedDate: publishedDate, 
        subjects: subjects, 
        pageCount: pageCount, 
        isbn10: isbn10, 
        isbn13: isbn13,
        synopsis: synopsis
    }; 
    
    if (result.volumeInfo.hasOwnProperty("imageLinks") && result.volumeInfo.imageLinks.hasOwnProperty("thumbnail")) {
        book.cover = result.volumeInfo.imageLinks.thumbnail;    
    }
    if (result.volumeInfo.hasOwnProperty("title")) {
        book.title = result.volumeInfo.title; 
    }
    if (result.volumeInfo.hasOwnProperty("authors")) {
        book.authors = result.volumeInfo.authors.join(', ');     
    }
    if (result.volumeInfo.hasOwnProperty("publisher")) {
        book.publisher = result.volumeInfo.publisher;
    }
    if (result.volumeInfo.hasOwnProperty("publishedDate")) {
        book.publishedDate = result.volumeInfo.publishedDate;
    }
    if (result.volumeInfo.hasOwnProperty("categories")) {
        book.subjects = result.volumeInfo.categories.join(", ");
    }
    if (result.volumeInfo.hasOwnProperty("pageCount")) {
        book.pageCount = result.volumeInfo.pageCount;
    }
    if (result.volumeInfo.hasOwnProperty("description")) {
        book.synopsis = result.volumeInfo.description;
    }
    
    let isbns = result.volumeInfo.industryIdentifiers; 
    if (isbns[0].type == "ISBN_10") {
        book.isbn10 = isbns[0].identifier; 
    } else if (isbns[0].type == "ISBN_13") {
        book.isbn13 = isbns[0].identifier; 
    }    
    if (isbns[1].type == "ISBN_10") {
        book.isbn10 = isbns[1].identifier; 
    } else if (isbns[1].type == "ISBN_13") {
        book.isbn13 = isbns[1].identifier; 
    }
    
    console.log(JSON.stringify(book));
    return new Promise(function(resolve, reject) {
        if (true) {
            resolve(book); 
        } else {
            reject("Error");
        }
    }); //Promise 
} //getBookInfo

// empty text input: intitle:+inauthor:+subject:
function getParameters(req) {
    let flag1 = 0;
    let flag2 = 0; 
    let flag3 = 0;
    let params = 'q=';
    if (req.query.title) {
        params += 'intitle:' + req.query.title
        flag1 = 1; 
    } 
    
    if (req.query.author) {
        if (flag1) {
            params+='+'
        }
        params += 'inauthor:' + req.query.author;
        flag2 = 2; 
    } 
    
    if (req.query.subject) {
        if (flag1 || flag2) {
            params+='+'
        }
        params += 'subject:' + req.query.subject;
        flag3 = 1; 
    } 
    
    if (! (flag1 || flag2 || flag3) ) {
        params += '\'\'';
    }
    console.log(params);
    return params;
} //getParameters

function getResults(params) {
    let URL = 'https://www.googleapis.com/books/v1/volumes?'; 
    // let PARAMS = getParameters(req); 
    // console.log(PARAMS);
    return new Promise(function(resolve, reject) {
        request(URL + params, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);
                // console.log("parameters: " + params);
                // console.log("SUCCESS"); 
                // console.log(parsedData);
                resolve(parsedData);
            } else {
                reject(error); 
                console.log(response.statusCode); 
                console.log(response.error);
            }
            
        }); //request
    }); //Promise
} //getResults

function checkUserReviews(ISBN, user) {
    let stmt = 'SELECT username FROM reviews WHERE ISBN=? AND username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [ISBN, user], function(error, results){
           if(error) throw error;
           console.log(results);
           resolve(results);
       }); //connection
    }); //Promise
} //checkUserReviews

function getReviews(ISBN) {
    let stmt = 'SELECT * FROM reviews WHERE ISBN=? ORDER by date';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [ISBN], function(error, results){
           if(error) throw error;
           resolve(results);
       }); //connection 
    }); //Promise
} //getReviews

function addReview(req, datetime) {
    let stmt = 'INSERT INTO reviews (ISBN, username, review, date, edit) VALUES (?, ?, ?, ?, ?)'; 
    let data = [req.params.ISBN, req.body.username, req.body.newReview, datetime, 0]; 
    console.log(data);
    connection.query(stmt, data, function(error, result){
           if(error) throw error;
           else {
               connection.query('SELECT * from reviews', function(error, result) {
                   if (error) throw error; 
                   else {
                       console.log(result);
                   }
               })
           }
    }); //connection
} //addReview



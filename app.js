const express = require("express");
const request = require('request');
const bodyParser = require("body-parser");
const _ = require('lodash');
const mysql = require('mysql');
const moment = require('moment-timezone');
// const moment = require('moment');
const session = require('express-session');
const bcrypt = require('bcrypt');

const port = 8080;
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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


/* MIDDLEWARE */
function isAuthenticated(req, res){
    if(!req.session.authenticated) return false;
    else return true;
}

function checkUsername(username){
    let stmt = 'SELECT * FROM users WHERE username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [username], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}

function checkPassword(password, hash){
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hash, function(error, result){
          if(error) throw error;
          console.log("Result in checkPassword function: ", result);
          resolve(result);
       }); 
    });
}

app.post('/loginSession', async function(req, res){
    let userExists = await checkUsername(req.body.username);
    console.log("Credentials user tried to sign in with: ", req.body.username, req.body.password);
    console.log("User data from database: ", userExists);
    let hashedPassword = userExists.length > 0 ? userExists[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPassword);
    console.log("Passowrds match results: ", passwordMatch);
	if(passwordMatch){
	    req.session.authenticated = true;
	    req.session.user = userExists[0].username;
	    res.redirect('/');
	} else {
	    res.render('login.ejs', {error: true, user: req.session.user});
	}
});

app.post('/register', function(req, res){
    let salt = 10;
    if (req.body.password == req.body.confirmPassword){
        console.log("Registered with:", req.body.username, req.body.password);
        bcrypt.hash(req.body.password, salt, function(error, hash){
            if(error) throw error;
            let stmt = 'INSERT INTO users (username, password) VALUES (?, ?)';
            let data = [req.body.username, hash];
            connection.query(stmt, data, function(error, result){
                if(error && error.errno == 1062){
                    //catch duplicate username error
                    console.log(error.errno);
                    res.render('signup.ejs', {error: true, user: req.session.user});
                } else {
                   res.render('login.ejs', {error: false, user: req.session.user});
                }
            });
        });
    } 
    //catch failed to type the same password error
    else {
        res.render('signup.ejs', {error: false, user: req.session.user});
    }
});

//routes
app.get("/", function(req, res){
    console.log("Session user: ", req.session.user);   
    res.render("home.ejs", {user: req.session.user});
});

// title=A+&author=&subject=Criticism - no image, long title
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:JK%20Rowling+subject:'' -> no books found
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:+subject: -> no books found
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:JK%20Rowling+subject:  -> books found

app.get("/results", async function(req, res){
    res.locals.user = req.session.username;
    let params = getParameters(req); 
    let books = await getResults(params);
    // console.log('in results');
    // console.log(results.hasOwnProperty("imageLinks"));
    let count = 0; 
    // results.items.forEach(function(r) {
    //     console.log(r.volumeInfo.industryIdentifiers[0].hasOwnProperty("identifier")); 
    //     console.log(count);
    //     console.log(r.volumeInfo.title);
        
    //     count ++; 
    // })
    res.render("results.ejs", {books: books, user: req.session.user});
});

app.get("/signup", function(req, res){
    res.render("signup.ejs", {user: req.session.user});
});

app.get("/login", function(req, res){
    res.render("login.ejs", {error: false, user: req.session.user});
});


// https://www.googleapis.com/books/v1/volumes?q=subject:student -> [1] has no ISBN
// https://www.googleapis.com/books/v1/volumes?q=intitle:The%20Distribution%20of%20Mexico%27s%20Public%20Spending%20on%20Education+inauthor:Gladys%20Lopez%20Acevedo+Angel%20Salinas
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
    let usersWhoLeftReviews = await checkUserReviews(req.params.ISBN, "cathy"); 
    let hasUserLeftReview = usersWhoLeftReviews.length > 0 ? true: false; 
    console.log("userLeftReview = " + hasUserLeftReview);
    res.render("singleResult.ejs", {book: book, ISBN: req.params.ISBN, moment:moment, reviews: reviews, user: "cathy", hasUserLeftReview: hasUserLeftReview, user: req.session.user});
});

function checkUserReviews(ISBN, user) {
    let stmt = 'SELECT username FROM reviews WHERE ISBN=? AND username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [ISBN, user], function(error, results){
           if(error) throw error;
           console.log(results);
           resolve(results);
       }); 
    });
}
function getReviews(ISBN) {
    let stmt = 'SELECT * FROM reviews WHERE ISBN=? ORDER by date';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [ISBN], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
    
}


app.post("/addreview/:ISBN", function(req, res) {
    console.log(req.body.newReview);
    let datetime = moment().format(); 
    console.log(req.body);
    addReview(req, datetime);
    res.redirect("/results/" + req.params.ISBN); 
    // res.json({
    //     newReview: req.body.newReview, 
    //     username: req.body.username, 
    //     datetime: moment(datetime).fromNow()
    // }); 
}); 


function addReview(req, datetime) {
    let stmt = 'INSERT INTO reviews (ISBN, username, review, date) VALUES (?, ?, ?, ?)'; 
    let data = [req.params.ISBN, req.body.username, req.body.newReview, datetime]; 
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
    });
}


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
    
    // console.log("BOOK BOOK BOOK BOOK BOOK"); 
    // console.log(JSON.stringify(book)); 
    // console.log(result);
    // console.log(result.volumeInfo.hasOwnProperty("title")); 
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
}

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
}

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


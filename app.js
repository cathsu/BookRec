const express = require("express");
const request = require('request');
const bodyParser = require("body-parser");
const _ = require('lodash');
const mysql = require('mysql');
const moment = require('moment');
const session = require('express-session');
const bcrypt = require('bcrypt');

const port = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const databaseUsername = process.env.user;
const databasePassword = process.env.pass;
// const db_host = process.env.db_host;
// const database = process.env.database;

const connection = mysql.createConnection({
    host: 'un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', //'localhost',
    user: 'n79faddzcgwlc9y2', //databaseUsername,
    password: 'rmaw3d7xswece72u',//databasePassword,
    database: 'zdsrmp00qp1p5j1u' //'bookrec_db'
});
connection.connect();

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

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
           else if (!results.length) resolve(false); 
           else if (results[0].username != username) resolve(false);  
           resolve(results);
       }); 
    });
}

function checkPassword(password, hash){
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hash, function(error, result){
          if(error) throw error;
          resolve(result);
       }); 
    });
}

function checkSeededPassword(username, password) {
    let stmt = 'SELECT password FROM users WHERE username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [password], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}


///////////////////////////// HOME //////////////////////////////////
app.get("/", async function(req, res){
    let cards = await genCards();
    res.render("home.ejs", {user: req.session.user, featured: cards});
});

function genCards() {
    let statement =  'select * from featured_books';
    return new Promise(function(resolve, reject){
        connection.query(statement, function(error, found){
    	    if(error) throw error;
	        let cards = [];
	        let index = _.random(found.length);
            cards.push(found[(index+1)%found.length]);
            cards.push(found[(index+2)%found.length]);
            cards.push(found[(index+3)%found.length]);
            resolve(cards);
        });//connection
    }); //Promise
}

app.post("/backCards", function(req, res) {
    let statement =  'select * from featured_books';
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        let cards = [];
	        let card1 = req.body.card1;
	        found.forEach(function(item, index){
	           if(item.title == card1){
    	           cards[0] = found[(index+1).mod(found.length)];
    	           cards[1] = found[(index+2).mod(found.length)];
    	           cards[2] = found[(index+3).mod(found.length)];
	           }
	        });
            res.send(cards);
	    }//found.length
    });//connection
});//route

app.post("/forwardCards", function(req, res) {
    let statement =  'select * from featured_books';
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        let cards = [];
	        let card3 = req.body.card3;
	        found.forEach(function(item, index){
	           if(item.title == card3){
    	           cards[0] = found[(index-1).mod(found.length)];
    	           cards[1] = found[(index-2).mod(found.length)];
    	           cards[2] = found[(index-3).mod(found.length)];
	           }
	        });
            res.send(cards);
	    }//found.length
    });//connection
});//route
///////////////////////////// SIGN UP/LOGIN //////////////////////////////////


app.get("/signup", function(req, res){
    res.render("signup.ejs", {user: req.session.user});
});

app.get("/login", function(req, res){
    res.render("login.ejs", {error: false, user: req.session.user});
});

app.post('/loginSession', async function(req, res){
    let userExists = await checkUsername(req.body.username);
    if (!userExists) {
        res.render('login.ejs', {error: true, user: req.session.user});
    } else {
        let hashedPassword = userExists.length > 0 ? userExists[0].password : '';
        let passwordMatch = await checkPassword(req.body.password, hashedPassword);
        let seededPasswordExist= await checkSeededPassword(req.body.username, req.body.password);
        let seededPasswordMatch = seededPasswordExist.length > 0 ? true: false;  
    	if(passwordMatch || seededPasswordMatch){
    	    req.session.authenticated = true;
    	    req.session.user = userExists[0].username;
    	    res.redirect('/');
    	} else {
    	    res.render('login.ejs', {error: true, user: req.session.user});
    	}
    }
});

app.post('/register', function(req, res){
    let salt = 10;
    if (req.body.password == req.body.confirmPassword){
        bcrypt.hash(req.body.password, salt, function(error, hash){
            if(error) throw error;
            let stmt = 'INSERT INTO users (username, password, admin) VALUES (?, ?, ?)';
            let data = [req.body.username, hash, 0];
            connection.query(stmt, data, function(error, result){
                if(error && error.errno == 1062){
                    //catch duplicate username error
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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

///////////////////////////// RESULTS //////////////////////////////////
app.get("/results", async function(req, res){
    res.locals.user = req.session.username;
    let params = getParameters(req); 
    let books = await getResults(params);
    res.render("results.ejs", {books: books, user:req.session.user});
});


// 
app.get("/results/:ISBN", async function(req, res){
    let results = await getResults('q=isbn:'+req.params.ISBN);
    let book =  await getBookInfo(results.items[0]); 
    let reviews = await getReviews(req.params.ISBN); 
    let usersWhoLeftReviews = await checkUserReviews(req.params.ISBN, req.session.user); 
    let hasUserLeftReview = usersWhoLeftReviews.length > 0 ? true: false; 
    res.render("singleResult.ejs", {
                    book: book, 
                    ISBN: req.params.ISBN, 
                    moment:moment, 
                    reviews: reviews, 
                    user: req.session.user, 
                    hasUserLeftReview: hasUserLeftReview
                });
});

app.post("/review/:ISBN", async function(req, res) {
    let datetime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    await addReview(req, datetime);
    res.redirect("/results/" + req.params.ISBN); 
}); 

app.put("/review/:ISBN", async function(req, res) {
    await editReview(req);
    res.json ({
        OK: "OK"
    }); 
    
});

/* Delete a review record */
app.delete('/review/delete', async function(req, res) {
    res.send(await deleteReview(req));
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
    return params;
} //getParameters

function getResults(params) {
    let URL = 'https://www.googleapis.com/books/v1/volumes?'; 
    return new Promise(function(resolve, reject) {
        request(URL + params, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);
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
    let data = [req.params.ISBN, req.session.user, req.body.newReview, datetime, 0]; 
    return new Promise(function(resolve, reject){
       connection.query(stmt, data, function(error, result){
           if(error) throw error;
           resolve(result);
        }); //connection
    }); //Promise
} //addReview

function editReview(req) {
    let stmt = 'UPDATE reviews ' + 
                'SET review = ?, edit = ? ' + 
                'WHERE ISBN = ? and username = ?'; 
    let data = [req.body.editedReview, 1, req.params.ISBN, req.session.user];
    return new Promise(function(resolve, reject){
       connection.query(stmt, data, function(error, results){
           if(error) throw error;
           resolve(results);
       }); //connection 
    }); //Promise
} //editReviews


function deleteReview(req) {
    let stmt = 'DELETE from reviews ' +
                'WHERE ISBN = ? and username = ?'; 
    let data = [req.body.isbn, req.body.username];
    return new Promise((resolve, reject) => {
        connection.query(stmt, data, (error, results) =>{
            if(error) throw error;
            resolve(results);
        });
    });
}

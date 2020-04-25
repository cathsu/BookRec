const express = require("express");
const request = require('request');
const bodyParser = require("body-parser");
const _ = require('lodash');
const mysql = require('mysql');
const port = 8080;
const app = express();

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const api_key = process.env.book_key;
const databaseUsername = process.env.user;
const databasePassword = process.env.pass;
localStorage.setItem("username", "");
localStorage.setItem("password", "");

const connection = mysql.createConnection({
    host: 'localhost',
    user: databaseUsername,
    password: databasePassword,
    database: 'bookrec_db'
});
connection.connect();

//routes
app.get("/", function(req, res){
    res.render("home.ejs");
});

// title=A+&author=&subject=Criticism - no image, long title
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:JK%20Rowling+subject:'' -> no books found
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:+subject: -> no books found
// https://www.googleapis.com/books/v1/volumes?q=intitle:Harry%20Potter+inauthor:JK%20Rowling+subject:  -> books found

app.get("/results", async function(req, res){
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
    res.render("results.ejs", {books: books});
});

app.get("/signup", function(req, res){
    res.render("signup.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});


// https://www.googleapis.com/books/v1/volumes?q=subject:student -> [1] has no ISBN
// https://www.googleapis.com/books/v1/volumes?q=intitle:The%20Distribution%20of%20Mexico%27s%20Public%20Spending%20on%20Education+inauthor:Gladys%20Lopez%20Acevedo+Angel%20Salinas
app.get("/results/:ISBN", async function(req, res){
    let results = await getResults('q=isbn:'+req.params.ISBN);
    console.log(results);
    let book =  await getBookInfo(results.items[0]); 
    // console.log(JSON.stringify(book));
    console.log(book);
    res.render("singleResult.ejs", {book: book, ISBN: req.params.ISBN});
});


app.post("/addreview/:ISBN", function(req, res) {
    console.log(req.body);
    
}); 


app.get("/populateCards", function(req, res) {
    let statement =  'select * from featured_books';
    let body = req.body.card1;
    console.log(body);
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        let cards = [];
	        let card1 = "The Hobbit";
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

app.post('/', function(req, res){
    let statement = 'select * from users where username=\'' + req.body.username + '\';';
    connection.query(statement, function(error, found){
	    if(error) throw error;
	    if(found.length){
	        console.log(found);
	        if(found[0].password == req.body.password){
	            localStorage.setItem("username", "test "+req.body.username);
                localStorage.setItem("password", "test "+req.body.password);
                res.render("home.ejs");
	        } else {
	            res.render("login.ejs");
	        }
	    }else {
            res.render("login.ejs");
        }//found.length
    });//connection
});//route

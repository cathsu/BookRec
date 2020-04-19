const express = require("express");
const request = require('request');
const _ = require('lodash');
const port = 8080;
const app = express();

app.use(express.static("public"));

var api_key = process.env.book_key;

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
    console.log(JSON.stringify(book));
    // res.render("singleResult.ejs", );
});

app.listen(process.env.PORT || port, function(){
    console.log("server is running...");
});


function getBookInfo(result) {
    let title = "No title available";
    let authors = "No author available";
    let publisher = "No publisher available"; 
    let publishedDate = "No data available";
    let synopsis = "No synopsis available"; 
    let subject = "No subject available"; 
    let pageCount = "No page count available"; 
    
    console.log("fine"); 
    let book = {
        title: title, 
        authors: authors, 
        publisher: publisher, 
        publishedDate: publishedDate, 
        subject: subject, 
        pageCount: pageCount, 
        synopsis: synopsis
    }; 
    
    console.log(JSON.stringify(book)); 
    console.log(result);
    console.log(result.volumeInfo.hasOwnProperty("title")); 
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
        book.subject = result.volumeInfo.categories.join(", ");
    }
    if (result.volumeInfo.hasOwnProperty("pageCount")) {
        book.pageCount = result.volumeInfo.pageCount;
    }
    if (result.volumeInfo.hasOwnProperty("description")) {
        book.synopsis = result.volumeInfo.synopsis;
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
                console.log("parameters: " + params);
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

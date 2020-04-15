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
    let results = await getResults(req);
    console.log('in results');
    // console.log(results.hasOwnProperty("imageLinks"));
    let count = 0; 
    results.items.forEach(function(r) {
        console.log(r.volumeInfo.hasOwnProperty("imageLinks")); 
        console.log(count);
        console.log(r.volumeInfo.title);
        
        count ++; 
    })
    res.render("results.ejs", {results: results});
});

app.get("/signup", function(req, res){
    res.render("signup.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/results/:ISBN", function(req, res){
    res.render("singleResult.ejs");
});

app.listen(process.env.PORT || port, function(){
    console.log("server is running...");
});


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

function getResults(req) {
    let URL = 'https://www.googleapis.com/books/v1/volumes?'; 
    let PARAMS = getParameters(req); 
    console.log(PARAMS);
    return new Promise(function(resolve, reject) {
        request(URL + PARAMS, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);
                console.log("SUCCESS"); 
                console.log(parsedData);
                resolve(parsedData);
            } else {
                reject(error); 
                console.log(response.statusCode); 
                console.log(response.error);
            }
            
        }); //request
    }); //Promise
} //getResults

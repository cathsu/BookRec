const express = require("express");
const request = require('request');
const _ = require('lodash');
const port = 8080;
const app = express();

app.use(express.static("public"));

const api_key = process.env.book_key;
const databaseUsername = process.env.user;
const databasePassword = process.env.pass;

const connection = mysql.createConnection({
    host: 'localhost',
    user: databaseUsername,
    password: databasePassword,
    database: 'featured_books'
});
connection.connect();

//routes
app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/results", function(req, res){
    res.render("results.ejs");
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

app.get("/populateCards", function(req, res) {
    let 
})

app.listen(process.env.PORT || port, function(){
    console.log("server is running...");
});
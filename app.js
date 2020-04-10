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

app.listen(process.env.PORT || port, function(){
    console.log("server is running...");
});
const express = require("express");
const request = require('request');
const mysql = require('mysql');
const _ = require('lodash');
const bodyParser = require('body-parser');
const port = 8080;
const app = express();

let firstBook = 0;
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
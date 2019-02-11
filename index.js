const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



//Models
 let Article = require('./models/Article');


//Connecting to mongoDB
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
	console.log("Connected to MongoDB...")
})

//Check Errors of MongoDB
db.on('error', function(err) {
	console.log(err)
})




//Initialize app
const app = express();



//MIDDLEWARES

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//set public folder for static contents
app.use(express.static(path.join(__dirname, 'public')));


//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')




//Home route
app.get('/', function(req, res){
	Article.find({}, function(err, articles){
		if (err) {
			console.log(err)
		} else {
			res.render('index', {
				title: 'Node Arctic',	
				articles: articles
			});
		}
	})
})

//Add articles route
app.get('/articles/add', function(req, res){
	res.render('add_articles', {
		title: 'Node Arctic',
	});
})

//articles save route
app.post('/articles/add', function(req, res){
	let article = new Article();

	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err) {
		if (err) {
			console.log(err)
		}
		else{
			res.redirect('/');
		}
	});
});




//Server initiating
app.listen(4000, function(){
	console.log("Server Started On Port 4000");
});
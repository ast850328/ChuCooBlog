const express = require('express');
const md5 = require('md5'); // md5 module
const bodyParser = require('body-parser'); // req.body transfer to json
const cookieParser = require('cookie-parser'); // cookie-parser for setting cookie
const cors = require('cors');
const jsonfile = require('jsonfile'); // write json file
const loginRoute = require('./login.js');
const authorsRoute = require('./authors.js');
const postsRoute = require('./posts.js');

/**
 * Global variables
 */
const usersfile = './users.json';
const postsfile = './posts.json';
cookieName = 'NODEJSSESSIONID';
const date = new Date();
let users = require('./users.json');
let posts = require('./posts.json');
_cookies = {};

// new a express
const app = express();

/**
 * Middleware
 */

app.use(bodyParser.json());

app.use(cookieParser());
// cross domain access
app.use(cors({
	methods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'DELETE'],
	credentials: true,
	origin: true
}));

/**
 * Routes
 */

app.use('/login', loginRoute);

app.use('/authors', authorsRoute);

app.use('/posts', postsRoute);

app.use(function (req, res, next) {
	return res.status(404).json({
		message: 'method not found.'
	});
});

app.listen(3000, function () {
  console.log('http://localhost:3000');  
});
var express = require('express');
var app = express();
// md5 module
var md5 = require('md5');
// write json file
var jsonfile = require('jsonfile');
// users 每一次讀到的json
let users = require('./users.json');
let posts = require('./posts.json');
// json to write
var usersfile = './users.json';
var postsfile = './posts.json';
// req.body transfer to json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// cookie-parser for setting cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var cors = require('cors');
app.use(cors({
	methods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'DELETE'],
	credentials: true,
	origin: true
}));

var date = new Date();
var _cookies = {};

app.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        if (users[i].password === password) {
          const user = {
            "username": users[i].username,
            "name": users[i].name,
            "gender": users[i].gender,
            "address": users[i].address
          }
          // setting cookie
          var uuid = md5(username + date.getTime());
          _cookies[uuid] = username;
          res.cookie('NODEJSSESSIONID', uuid);
          res.send(user);
        } else {
          res.status(401).json({
            message: '帳號或密碼錯誤'
          });  
        }
      } else {
        res.status(401).json({
          message: '帳號或密碼錯誤'
        });  
      }
    }
  } else {
    res.status(401).json({
      message: '帳號或密碼錯誤'
    });
  }
});

app.get('/authors/:id', function (req, res) {
  var id = req.params.id;
  for (var i = 0; i < users.length; i++) {
    if (id === users[i].username) {
      var user = {
        "username": users[i].username,
        "name": users[i].name,
        "gender": users[i].gender,
        "address": users[i].address
      }
      res.send(user);
    } else {
      res.status(404).json({
        message: '沒有這個使用者'
      });
    }
  }
});

app.get('/posts', function (req, res) {
  res.send(posts);
});

app.get('/posts/:id', function (req, res) {
  var id = parseInt(req.params.id);
  var i = 0;
  for (i = 0; i < posts.length; i++) {
    if (id === posts[i].id) {
      break;
    }
  }
  if (i < posts.length) {
    res.send(posts[i]);
  } else {
    res.status(404).json({
      message: '沒有這則文章'
    });
  }
});

// require login
// usr -> user basic profile (exclude password)
var usr;
// check cookie
app.use(function(req, res, next) {
  var cookieID = req.cookies.NODEJSSESSIONID;
  if (_cookies[cookieID]) {
    var usrID = _cookies[cookieID];
    var i;
    for (i = 0; i < users.length; i++) {
      if (usrID === users[i].username) {
        break;
      }
    }
    usr = {
      username: users[i].username,
      name: users[i].name,
      gender: users[i].gender,
      address: users[i].address
    }
    next();
  } else {
    res.status(401).json({
      message: 'please LOGIN.'
    });
  }
});

app.get('/login', function (req, res) {
    res.send(usr);
});

app.patch('/authors/:id', function (req, res) {
  var id = req.params.id;
  var password = req.body.password;
  var name = req.body.name;
  var gender = req.body.gender;
  var address = req.body.address;
  var i = 0;
  for(i = 0; i < users.length; i++) {
    if (id === users[i].username)
      break;
  } 
  if (i < users.length) {
    var user = {
      "username": id,
      "name": name,
      "gender": gender,
      "address": address
    }
    users[i].name = name;
    users[i].gender = gender;
    users[i].address = address;
    users[i].password = password;
    jsonfile.writeFile(usersfile, users, function(err) {

    });
    res.send(user);
  } else {
    res.status(404).json({
      message: '沒有這個使用者'
    });
  }
});

app.post('/posts', function (req, res) {
  if (!req.body.title) {
    res.status(400).json({
      message: "title 必填"
    });
  } else if (!req.body.content) {
    res.status(400).json({
      message: "content 必填"
    });
  } else if (!req.body.tags) {
    res.status(400).json({
      message: "tags 必填"
    });
  } else {
    title = req.body.title;
    content = req.body.content;
    tags = req.body.tags;
    var id = new Date().valueOf();
    var post = {
      id: id,
      title: title,
      content: content,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
      author: usr,
      tags: tags
    };
    posts.push(post);
    jsonfile.writeFile(postsfile, posts, function(err) {
      });
    res.send(post);
  }
});

app.patch('/posts/:id', function (req, res) {
  title = req.body.title;
  content = req.body.content;
  tags = req.body.tags;
  id = parseInt(req.params.id);
  var i = 0;
  for (i = 0; i < posts.length; i++) {
    if (id === posts[i].id)
      break;
  }
  if (i < posts.length) {
    posts[i].title = title;
    posts[i].content = content;
    posts[i].tags = tags;
    posts[i].updated_at = date.toISOString();
    jsonfile.writeFile(postsfile, posts, function(err) {
    });
    res.send(posts[i]);  
  } else {
    res.status(404).json({
      message: '沒有這則文章'
    });
  }
});

app.delete('/posts/:id', function (req, res) {
  id = parseInt(req.params.id);
  var i;
  for (i = 0; i < posts.length; i++) {
    if (id === posts[i].id)
      break;
  }
  if (i < posts.length) {
    posts.splice(i, 1);
    jsonfile.writeFile(postsfile, posts, function(err) {
    });
    var message = {
      remain: posts.length
    }
    res.send(message);
  } else {
    res.status(404).json({
      message: '沒有這則文章'
    });
  }
});

app.use(function (req, res, next) {
  res.status(400).json({
    message: 'wrong method'
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
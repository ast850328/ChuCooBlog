const express = require('express');
var article = express.Router();
const model = require('./model.js');

const jsonfile = require('jsonfile');

let users = require('./users.json');
let posts = require('./posts.json');

const usersfile = './users.json';
const postsfile = './posts.json';


article.get('/', function (req, res) {
  res.send(posts);
});

article.get('/:id', function (req, res) {
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

var usr = null;

article.use(function (req, res, next) {
  usr = model.checkLogin(req);
    if (!usr)
      return res.status(401).json({
        message: 'please Login.'
      });
    next();
});

article.post('/', function (req, res) {
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
    var date = new Date();
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

article.patch('/:id', function (req, res) {
  title = req.body.title;
  content = req.body.content;
  tags = req.body.tags;
  id = parseInt(req.params.id);
  let date = new Date();
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

article.delete('/:id', function (req, res) {
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

module.exports = article;
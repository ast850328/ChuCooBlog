const express = require('express');
var authors = express.Router();
const model = require('./model.js');

const jsonfile = require('jsonfile');
let users = require('./users.json');
const usersfile = './users.json';

var usr = null;

authors.use(function (req, res, next) {
  usr = model.checkLogin(req);
    if (!usr)
      return res.status(401).json({
        message: 'please Login.'
      });
    next();
});

authors.get('/:id', function (req, res) {
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

authors.patch('/:id', function (req, res) {
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

module.exports = authors;
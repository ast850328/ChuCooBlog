const express = require('express');
const login = express.Router();
const md5 = require('md5');
const model = require('./model.js');

let users = require('./users.json');
const usersfile = './users.json';

login.post('/', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: '缺少帳號或密碼'
    });
  }

  for (let user of users) {
    if (user.username === username && user.password === password) {
      const userData = {
        username: user.username,
        name: user.name,
        gender: user.gender,
        address: user.address
      };

       // set cookie
      var uuid = md5(username + (new Date()).getTime());
      _cookies[uuid] = username;
      res.cookie(cookieName, uuid);

      return res.status(200).json(user);
    }
  }

  return res.status(401).json({
    message: '帳號或密碼錯誤'
  });
});

login.get('/', function (req, res) {
    var usr = model.checkLogin(req);
    if (!usr)
      return res.status(401).json({
        message: 'please Login.'
      });
    return res.send(usr);

});

module.exports = login;
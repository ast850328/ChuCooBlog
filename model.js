let users = require('./users.json');

function checkLogin(req) {
    var cookieID = req.cookies.NODEJSSESSIONID;
    if (_cookies[cookieID]) {
        var usrID = _cookies[cookieID];
        var i;
        for (i = 0; i < users.length; i++) {
        if (usrID === users[i].username) {
            break;
        }
        }
        var usr = {
        username: users[i].username,
        name: users[i].name,
        gender: users[i].gender,
        address: users[i].address
        }
        return usr;
    } else {
        return false;
    }
}

module.exports = {
    checkLogin: checkLogin
};
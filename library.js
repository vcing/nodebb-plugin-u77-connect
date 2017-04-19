(function (module) {
    "use strict";
    var passport = module
        .parent
        .require("passport");
    var passportLocal = module
        .parent
        .require('passport-local')
        .Strategy;
    var U77Connect = {};
    var controllers = module
        .parent
        .require('./controllers');
    var User = module
        .parent
        .require('./user');
    var db = module
        .parent
        .require('./database');
    var request = require('request');

    U77Connect.init = function (params, callback) {
        console.log('-----------------u77 connect-----------------');
        callback();
    }

    U77Connect.auth = function () {
        passport.use(new passportLocal({
            passReqToCallback: true
        }, login));
    }

    function login(req, username, password, next) {
        request
            .post('http://n.u77.com/member/login-api', {
                form: {
                    username: username,
                    password: password
                }
            }, function (err, response, body) {
                try {
                    body = JSON.parse(body);
                    body.user.detail = JSON.parse(body.user.detail);
                } catch (e) {
                    next(e);
                    return;
                }
                if (err) {
                    next(err);
                    return;
                }
                if (body.err) {
                    next(null, false, body.msg);
                    return;
                }
                if (body.user.detail.uid) {
                    next(null, {uid: body.user.detail.uid});
                    return;
                }
                let userData = {
                    username: body.user.name,
                    email: body.user.email || '',
                    password: (Math.random() * 10000000000).toFixed(0),
                    picture: 'http://img.u77.com/avatar/' + body.user.avatar,
                    gravatarpicture: 'http://img.u77.com/avatar/' + body.user.avatar
                }
                User.create(userData, function (err, uid) {
                    if (err) {
                        next(err);
                        return;
                    }
                    request('http://n.u77.com/user/uid?id=' + body.user.id + '&uid=' + uid, function (err, response, body) {
                        next(null, {uid: uid});
                    });
                });
            });
    }

    U77Connect.routeFilter = function (req, res, next) {
        // controllers.register(req,res,next);
        next();
    }

    module.exports = U77Connect;
}(module));
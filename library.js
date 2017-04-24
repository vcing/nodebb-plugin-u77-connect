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
    var authenticationController = module
        .parent
        .require('./controllers/authentication');
    var u77path = require('./config.json').u77path;
    var crypto = require('crypto');
    var secret = require('./config.json').secret;

    U77Connect.init = function (params, callback) {
        console.log('-----------------u77 connect-----------------');
        params
            .router
            .get('/auth/qq', function (req, res) {
                res.redirect(u77path + 'member/login/qq/forum');
            });
        params
            .router
            .get('/auth/weibo', function (req, res) {
                res.redirect(u77path + 'member/login/weibo/forum');
            });
        callback();
    }

    U77Connect.routeFilter = function (req, res, next) {
        // controllers.register(req,res,next);
        next();
    }

    U77Connect.getStrategy = function (strategies, callback) {
        passport.use('QQ', new passportLocal({
            passReqToCallback: true
        }, function (req, username, password, done) {
            if (req.query.username != 100) {
                done(new Error('登陆失败,请稍候再试.(多次失败请联系管理员.)'));
            }
            if (req.query.uid && req.query.uid != 0) {
                done(null, {uid: req.query.uid});
                return;
            } else {
                let userData = {
                    username: req.query.name,
                    email: req.query.email || '',
                    password: (Math.random() * 10000000000).toFixed(0),
                    picture: body.user.avatar == 'undefined'
                        ? 'http://img.u77.com/avatar/u77_avatar.jpg'
                        : 'http://img.u77.com/avatar/' + body.user.avatar,
                    gravatarpicture: body.user.avatar == 'undefined'
                        ? 'http://img.u77.com/avatar/u77_avatar.jpg'
                        : 'http://img.u77.com/avatar/' + body.user.avatar
                }
                User.create(userData, function (err, uid) {
                    if (err) {
                        done(err);
                        return;
                    }
                    request(u77path + 'user/uid?id=' + req.query.id + '&uid=' + uid, function (err, response, body) {
                        done(null, {uid: uid});
                    });
                });
            }
        }));
        passport.use('Weibo', new passportLocal({
            passReqToCallback: true
        }, function (req, username, password, done) {
            if (req.query.username != 100) {
                done(new Error('登陆失败,请稍候再试.(多次失败请联系管理员.)'));
            }
            if (req.query.uid && req.query.uid != 0) {
                done(null, {uid: req.query.uid});
                return;
            } else {
                let userData = {
                    username: req.query.name,
                    email: req.query.email || '',
                    password: (Math.random() * 10000000000).toFixed(0),
                    picture: 'http://img.u77.com/avatar/' + req.query.avatar,
                    gravatarpicture: 'http://img.u77.com/avatar/' + req.query.avatar
                }
                User.create(userData, function (err, uid) {
                    if (err) {
                        done(err);
                        return;
                    }
                    request(u77path + 'user/uid?id=' + req.query.id + '&uid=' + uid, function (err, response, body) {
                        done(null, {uid: uid});
                    });
                });
            }
        }));
        strategies.push({
            name: 'QQ',
            displayName: 'QQ',
            url: '/auth/qq',
            callbackURL: '/auth/qq/callback',
            icon: 'fa-qq',
            scope: ''
        });
        strategies.push({
            name: 'Weibo',
            displayName: 'Weibo',
            url: '/auth/weibo',
            callbackURL: '/auth/weibo/callback',
            icon: 'fa-weibo',
            scope: ''
        });
        callback(null, strategies);
    }

    U77Connect.getAssociation = function (data,callback) {
        
    }

    function md5(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf-8')
            .digest('hex');
    }

    module.exports = U77Connect;
}(module));
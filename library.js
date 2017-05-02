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
    var express = module
        .parent
        .require('express');

    U77Connect.init = function (params, callback) {
        console.log('-----------------u77 connect-----------------');
        // var pagesRouter = express.Router();
        var helpers = module
            .parent
            .require('./routes/helpers');
        helpers.setupPageRoute(params.router, '/testtag', params.middleware, [], function (req, res) {
            res.render('u77-connect/tags');
        });
        callback();
    }

    U77Connect.routeFilter = function (req, res, next) {
        // controllers.register(req,res,next);
        next();
    }

    U77Connect.getStrategy = function (strategies, callback) {
        callback(null, strategies);
    }

    U77Connect.getAssociation = function (data, callback) {
        callback(null, data);
    }

    function md5(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf-8')
            .digest('hex');
    }

    module.exports = U77Connect;
}(module));
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
    var controllers = module.parent.require('./controllers');


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
        next(null, {uid: 1});
    }

    U77Connect.routeFilter = function(req,res,next) {
        // controllers.register(req,res,next);
    }

    module.exports = U77Connect;
}(module));
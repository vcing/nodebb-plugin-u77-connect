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

    U77Connect.init = function (data, callback) {
        console.log('-----------------u77 connect-----------------');
        callback();
    }

    U77Connect.auth = function () {
        passport.use(new passportLocal({
            passReqToCallback: true
        }, login));
    }

    function login(req, username, password, next) {
        next(null,{uid:1});
    }

    module.exports = U77Connect;
}(module));
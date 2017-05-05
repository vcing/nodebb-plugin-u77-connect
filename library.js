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
    var categories = module
        .parent
        .require('./categories');
    var async = module
        .parent
        .require('async');
    var User = module
        .parent
        .require('./user');
    var db = module
        .parent
        .require('./database');
    var request = require('request');
    var fs = require('fs');
    var authenticationController = module
        .parent
        .require('./controllers/authentication');
    var path = require('path');
    var crypto = require('crypto');
    // var secret = require('./config.json').secret;
    var express = module
        .parent
        .require('express');
    var app;

    U77Connect.init = function (params, callback) {
        app = params.app;
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

    function loadWidgetTemplate(template, next) {
        var __dirname = "./node_modules/nodebb-plugin-u77-connect";
        var templateFile = path.resolve(__dirname, template);
        // winston.info("Loading templateFile: " + templateFile);

        fs.readFile(templateFile, function (err, data) {
            if (err) {
                console.log(err.message);
                return next(null, err);
            }
            next(data.toString());
        });
    }

    U77Connect.getWidgets = function (widgets, callback) {
        loadWidgetTemplate('./templates/u77-connect/admin/category.tpl', function (templateData) {
            console.log(templateData);
            widgets = widgets.concat([
                {
                    widget: "category-widget",
                    name: "Category Widget",
                    description: "Renders the specific category",
                    content: templateData
                }
            ]);

            callback(null, widgets);
        });
    },

    U77Connect.render = function (params, callback) {
        var categoryController = controllers.category;
        try {
            var mockReq = {
                uid: params.uid,
                params: {
                    category_id: params.data.categoryId || 1,
                    slug: ''
                },
                query: {
                    page: '1'
                },
                session: {
                    returnTo: ''
                }
            }

            var resWrap = {
                locals: {},
                redirect: function (path) {},
                status: function (code) {
                    return {
                        render: function (code, data) {
                            
                        }
                    }
                },
                render: function (template, data) {
                    app.render('u77-connect/category', data, callback);
                }

            };

            async.waterfall([
                function (next) {
                    categories.getCategoryFields(parseInt(params.data.categoryId || 1), [
                        'slug', 'disabled', 'topic_count'
                    ], next);
                },
                function (topic, next) {
                    mockReq.params.slug = topic
                        .slug
                        .replace(/\d+\//g, "");
                    // winston.info("Intercepted topic request. topic id: " +
                    // mockReq.params.topic_id + " (slug from db): " + mockReq.params.slug);
                    categoryController.get(mockReq, resWrap, callback);
                }
            ]);
        } catch (e) {
            console.error(e);
        }

    }

    function md5(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf-8')
            .digest('hex');
    }

    module.exports = U77Connect;
}(module));
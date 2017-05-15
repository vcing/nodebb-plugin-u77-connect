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
    var translator = module
        .parent
        .require('../public/src/modules/translator');
    var controllers = module
        .parent
        .require('./controllers');
    var categories = module
        .parent
        .require('./categories');
    var async = module
        .parent
        .require('async');
    var nconf = module
        .parent
        .require('nconf');
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
    var express = module
        .parent
        .require('express');
    var app;
    var middleware;

    U77Connect.init = function (params, callback) {
        app = params.app;
        middleware = params.middleware;
        console.log('-----------------u77 connect-----------------');
        var helpers = module
            .parent
            .require('./routes/helpers');
        helpers.setupPageRoute(params.router, '/testtag', middleware, [], function (req, res) {
            res.render('u77-connect/tags');
        });
        callback();
    }

    U77Connect.routeFilter = function (req, res, next) {
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

        fs.readFile(templateFile, function (err, data) {
            if (err) {
                console.log(err.message);
                return next(null, err);
            }
            next(data.toString());
        });
    }

    // define widgets
    U77Connect.getWidgets = function (widgets, next) {

        async
            .map([
                {
                    widget: "category-widget",
                    name: "Category Widget",
                    description: "Renders the specific category",
                    content: 'u77-connect/admin/category'
                }, {
                    widget: "custom-recent-topics",
                    name: "Custom Recent Topics",
                    description: "Lists the latest topics on your forum.",
                    content: 'u77-connect/admin/recenttopics'
                }
            ], function (widget, _next) {
                app
                    .render(widget.content, {}, function (err, html) {
                        widget.content = html;
                        _next(err, widget);
                    });
            }, function (err, _widgets) {
                widgets = widgets.concat(_widgets);
                next(err, widgets);
            });
    },

    // category widget render function
    U77Connect.renderCategoryWidget = function (params, callback) {
        console.log(params);
        var categoryController = controllers.category;
        try {
            params.req.params = {
                category_id: params.data.categoryId,
                slug: ''
            };
            params.req.query = {
                page: 1
            };
            params.res.locals.isAPI = false;
            params.res.locals.config = {
                userLang: 'zh-CN'
            };
            var _render = params.res.render;

            params.res.render = function (template, data) {
                _render
                    .call(params.res, 'u77-connect/category', data, function (err, html) {
                        params.html = html;
                        callback(err, params);
                    });
            }

            async.waterfall([
                function (next) {
                    categories.getCategoryFields(parseInt(params.data.categoryId || 1), [
                        'slug', 'disabled', 'topic_count'
                    ], next);
                },
                function (topic, next) {
                    params.req.params.slug = topic
                        .slug
                        .replace(/\d+\//g, "");
                    categoryController.get(params.req, params.res, callback);
                }
            ]);
        } catch (e) {
            console.error(e);
        }

    }

    // custom topics widget render function
    U77Connect.renderCustomTopicsWidget = function (widget, callback) {
        var numTopics = (widget.data.numTopics || 8) - 1;
        var cid = widget.data.cid || 1
        var payload = {
            cid: cid,
            set: 'cid:' + cid + ':tids',
            reverse: true,
            start: 0,
            stop: Math.max(0, numTopics),
            uid: widget.req.uid
        };

        categories.getCategoryTopics(payload, function (err, data) {
            if (err) {
                return callback(err);
            }
            app
                .render('u77-connect/recenttopics', {
                    topics: data.topics,
                    numTopics: numTopics,
                    relative_path: nconf.get('relative_path')
                }, function (err, html) {
                    translator
                        .translate(html, function (translatedHTML) {
                            widget.html = translatedHTML;
                            callback(err, widget);
                        });
                });
        });
    };

    function md5(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf-8')
            .digest('hex');
    }

    module.exports = U77Connect;
}(module));
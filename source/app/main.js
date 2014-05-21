//noinspection ThisExpressionReferencesGlobalObjectJS
(function (root) {
    require(["config"], function (config) {
        requirejs.config(config);
        require(["app"], function (App) {
            var app_name = config.app_name || "App";
            root[app_name] = App;

            // setup our hash routes
            require(["routie"], function (routie) {
                routie(':moduleName/:pageName', function (moduleName, pageName) {
                    App.Router.switchPage(moduleName, pageName);
                });
            });

            /* add some stuff to the global namespace for convenience or IE support */
            // fixes for console.log
            if (!root.console) root.console = { log: function (m) {
            }};
            root.log = function (m) {
                if (typeof console != "undefined") {
                    console.log(m);
                }
            };
            App.log = root.log;

            // *** add an array for interval ids
            App.intervalIds = [];

            // implement JSON.stringify serialization
            root.JSON.stringify = JSON.stringify || function (obj) {
                var t = typeof (obj);
                if (t != "object" || obj === null) {
                    // simple data type
                    if (t == "string") obj = '"' + obj + '"';
                    return String(obj);
                }
                else {
                    // recurse array or object
                    var n, v, json = [], arr = (obj && obj.constructor == Array);
                    for (n in obj) {
                        v = obj[n];
                        t = typeof(v);
                        if (t == "string") v = '"' + v + '"';
                        else if (t == "object" && v !== null) v = JSON.stringify(v);
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                }
            };

            if (!root.Object.create) {
                root.Object.create = (function(){
                    function F(){}

                    return function(o){
                        if (arguments.length != 1) {
                            throw new Error('Object.create implementation only accepts one parameter.');
                        }
                        F.prototype = o;
                        return new F()
                    }
                })()
            }

            /***************************************************************
             * Helper functions for older browsers
             ***************************************************************/
            if (!Object.hasOwnProperty('create')) {
                Object.create = function (parentObj) {
                    function tmpObj() {
                    }

                    tmpObj.prototype = parentObj;
                    tmpObj.prototype.$super = parentObj;
                    return new tmpObj();
                };
            }
            if (!Object.hasOwnProperty('defineProperties')) {
                Object.defineProperties = function (obj, props) {
                    for (var prop in props) {
                        Object.defineProperty(obj, prop, props[prop]);
                    }
                };
            }

            // oscript parsing functions to add to javascript prototypes
            String.prototype.toOScript = function () {
                var _22 = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "'": "\\'", "\\": "\\\\"};
                if (/['\\\x00-\x1f]/.test(this)) {
                    return "'" + this.replace(/([\x00-\x1f\\'])/g, function (a, b) {
                        var c = _22[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    }) + "'";
                }
                return "'" + this + "'";
            };
            Array.prototype.toRecArray = function () {
                var columnDef = $A(arguments);
                var a = ["V{"];
                var _23 = [];
                var _24 = [];
                var _25 = columnDef.length;
                for (var j = 0; j < _25; ++j) {
                    if (Object.isArray(columnDef[j])) {
                        _23.push(columnDef[j][1]);
                        _24.push(columnDef[j][0].toOScript());
                    } else {
                        _23.push(columnDef[j]);
                        _24.push(columnDef[j].toOScript());
                    }
                }
                a.push("<", _24.join(","), ">");
                for (var i = 0, len = this.length; i < len; ++i) {
                    var row = [];
                    for (var j = 0; j < _25; ++j) {
                        var val = this[i][_23[j]];
                        var _26 = null;
                        if (val === null || Object.isUndefined(val)) {
                            _26 = "?";
                        } else {
                            _26 = App.OScriptParser.toOScript(val);
                        }
                        row.push(_26);
                    }
                    a.push("<", row.join(","), ">");
                }
                a.push("}");
                return a.join("");
            };
            Array.prototype.toOScript = function () {
                var a = [], i, l = this.length, v;
                for (i = 0; i < l; ++i) {
                    v = this[i];
                    switch (typeof v) {
                        case "undefined":
                            break;
                        case "function":
                            break;
                        case "unknown":
                            break;
                        case "object":
                            if (v) {
                                if (typeof v.toOScript === "function") {
                                    a.push(v.toOScript());
                                } else {
                                    a.push(App.OScriptParser.toOScript(v));
                                }
                            } else {
                                a.push("?");
                            }
                            break;
                        default:
                            a.push(v.toOScript());
                    }
                }
                return "{" + a.join(",") + "}";
            };
            Boolean.prototype.toOScript = function () {
                return String(this);
            };
            Date.prototype.toOScript = function () {
                var f = function (n) {
                    return n < 10 ? "0" + n : n;
                };
                return "\"" + this.getFullYear() + "-" + f(this.getMonth() + 1) + "-" + f(this.getDate()) + "T" + f(this.getHours()) + ":" + f(this.getMinutes()) + ":" + f(this.getSeconds()) + "\"";
            };
            Number.prototype.toOScript = function () {
                var result;
                if (isFinite(this)) {
                    var _27 = this.toFixed(5);
                    if (Math.round(_27) == _27) {
                        result = String(Math.round(_27));
                    } else {
                        result = "G" + String(_27);
                    }
                } else {
                    result = "?";
                }
                return result;
            };

            jQuery.browser = {};
            (function () {
                jQuery.browser.msie = false;
                jQuery.browser.version = 0;
                if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                    jQuery.browser.msie = true;
                    jQuery.browser.version = RegExp.$1;
                }
            })();

        });

    });
})(this);
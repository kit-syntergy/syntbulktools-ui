// Load our app
define([
    "router",
    "jquery",
    "OScriptParser",
    "FileController",
    "lodash",
    "ContentServerAPI",
    "ErrorController"
], function (router, $, OScriptParser, FileController, _, ContentServerAPI, ErrorController, JobScheduleController) {
    /*global App*/
    /*global LL_URL*/
    return {
        // make these accessible in the App global
        FileController: FileController,
        Router: router,
        OScriptParser: OScriptParser,
        ServerAPI: ContentServerAPI,
        ErrorController: ErrorController,
        ArrayUtils: function(arr){
            return {
                hasIt : false,
                contains : function(val, caseInsensitive){
                    _.each(arr, function(c){
                        switch (typeof val){
                            case "string":
                                var equals = caseInsensitive ? c.toUpperCase()===val.toUpperCase() : c===val;
                                if (equals) {this.hasIt = true;return}
                                break;
                            default:
                                equals = c===val;
                                if (equals) {this.hasIt = true;return;}
                        }
                    }, this);
                    return this.hasIt;
                }
            }
        },
        inheritFrom: function(o, parent, override){
            for (var key in parent) {
              if (parent.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
                  o[key] = parent[key];

              }
            }
        }
    };
});
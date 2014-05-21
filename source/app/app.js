// Load our app
define([
    "router",
    "jquery",
    "OScriptParser",
    "FileController",
    "lodash",
    "ContentServerAPI"
], function (router, $, OScriptParser, FileController, _, ContentServerAPI, JobScheduleController) {
    /*global App*/
    /*global LL_URL*/
    return {
        // make these accessible in the App global
        FileController: FileController,
        Router: router,
        OScriptParser: OScriptParser,
        ServerAPI: ContentServerAPI,
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
        }};
});
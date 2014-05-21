define(["async", "lodash"],
    function (async, _) {
        /*global App*/
        return {
            jobId: 0,
            nodeIdArray: [],
            nodeObjects: {},
            totalNumItems: 0,
            NONFATAL_ERROR_PERCENT_LIMIT: 25,
            EVAL_LIMIT: 0,
            errorNodes: [],
            hasResultsToClear: false,
            showLimitReached: false,
            isCancelled: false,
            exit: false,

            resetProcess: function (resetJobId) {
                if (this.errorNodes.length){
                    App.SourceViewController.clearResults(this.errorNodes);
                }
                this.errorNodes = [];
                this.nodeIdArray = [];
                this.nodeObjects = {};
                this.EVAL_LIMIT = 0;
                this.isCancelled = false;
                if (resetJobId){
                    this.jobId = 0;
                }
                this.exit = false;
                this.hasResultsToClear = false;
            },

            skipNode: function (id, path) {
                // TODO complete this code
            },

            includeNode: function (id, path) {
                // TODO complete this code
            },

            getNodes: function (startNo, endNo) {
                var retObj = {};
                for (var i = startNo; i <= endNo; i++) {
                    retObj[i] = this.nodeObjects[i];
                }
                return retObj;
            },

            setInvalidForLoad : function () {
                // just set the jobId to 0
            },

            processSuccessNode: function (node, text) {
                node["ok"] = true;
                this.nodeObjects[node.id] = node;
                App.SourceViewController.showSuccessNode(node["id"], node["path"], text);
            },

            processSkippedNode: function (node, text) {
                node["skip"] = true;
                this.nodeObjects[node.id] = node;
                App.SourceViewController.showSkippedNode(node["id"], node["path"], text);
            },

            processErrorNode: function (node, errMsg) {
                node["errMsg"] = errMsg;
                node["ok"] = false;
                this.nodeObjects[node.id] = node;
                App.SourceViewController.showErrorNode(node["id"], node["path"], errMsg);
                this.errorNodes.push({"id": node["id"], "path": node["path"]});
            },

            initializeLoadExport: function (optionStr, context, avgTime, resetJobId) {
                var that = this;
                var dfd = $.Deferred();

                var total = App.PageController.totalNumItems;
                var seconds = Math.max(Math.round(total * avgTime), 1);
                var progressBar = App.PageController.showLoadingIndicator("Gathering Data", true, seconds);
                this.resetProcess(resetJobId);

                // update progress bar every 2 secs
                var complete = false;

                // get any source settings (like hidden vals, push down vals, etc)
                var settings = App.SourceViewController.getSourceSettings();

                var intervalId = window.setInterval(function () {
                        progressBar.updateClock()
                    }, 1000
                );

                // add the jobId to optionStr
                optionStr += "&jobId" + this.jobId + "&totalNumItems=" + total;
                $.when(App.ServerAPI.initializeProcess(App.PageController.actionToPerform, App.PageController.colNames, optionStr, this.jobId, settings, this))
                    .done(function (result) {
                        clearInterval(intervalId);
                        App.PageController.hideLoadingIndicator();
                        context.EVAL_LIMIT = result["limit"]
                        context.jobId = result["jobId"];
                        context.nodeIdArray = result["nodeIdArray"];
                        context.nodeObjects = result["nodeObjects"];
                        context.totalNumItems = result["totalNumItems"];
                        log("Job Count=" + result["totalNumItems"]);
                        log("Elapsed Time=" + result["elapsed"]);
                        log("Average Time=" + result["average"]);
                        dfd.resolve(result);
                    })
                    .fail(function (errMsg) {
                        clearInterval(intervalId);
                        App.PageController.hideLoadingIndicator();
                        dfd.reject(errMsg);
                    });

                return dfd.promise();

            },

            cancel: function () {
                this.isCancelled = true;
            },

            hasReachedErrorLimit: function (total, num) {
                var limit = this.NONFATAL_ERROR_PERCENT_LIMIT;
                return ((num / total) * 100) > limit;
            },

            iterateNodes: function (jobId, successFunc, fatalErrFunc, nonFatalErrFunc, nodeArray, progressBar, apiFunc, result) {
                result = (typeof result === "undefined") ? {nonFatalErrors: 0, ok: true, errMsg: null} : result;
                var that = this;
                var i = -1;
                // show progress bar
                progressBar.show(true);

                async.whilst(
                    function () {
                        return !that.exit;

                        // test
                        // return true if all is ok
                        // return false to abort
                    },
                    function (callback) {
                        i++;
                        var chunk = nodeArray[i];
                        $.when(that.processChunkAsync(apiFunc, jobId, chunk, result))
                            .done(function (rtn) {
                                if (that.hasReachedErrorLimit(progressBar.total, result.nonFatalErrors)) {
                                    callback("Error Limit Reached: More than " + that.NONFATAL_ERROR_PERCENT_LIMIT + "% of the load has errors. Cancelling the rest of job.");
                                    log("reached error limit")
                                }
                                else if (progressBar.numDone > that.EVAL_LIMIT) {
                                    callback("You've reached the Evaluation limit for this job. To load or export more items, please purchase a license");
                                    log("reached evalLimit")
                                }
                                else if (that.isCancelled) {
                                    that.exit = true;
                                    callback(null);
                                    log("cancelled")
                                }
                                else {
                                    progressBar.update(chunk.length);
                                    if (progressBar.isFinished()) {
                                        progressBar.finish();
                                        if (result.nonFatalErrors > 0) {
                                            nonFatalErrFunc(result)
                                        } else if (result.ok) {
                                            successFunc();
                                        }
                                        that.exit = true;
                                    }
                                    callback(null);
                                }
                            })
                            .fail(function (errMsg) {
                                // we have an error. call the callback to exit out of loop
                                callback(errMsg);
                            });
                    },

                    function (errMsg) {
                        if (errMsg) {
                            fatalErrFunc(errMsg);
                            that.exit = true;
                        }
                    }
                );

            },

            actionWrapper: function (apiFunc, args, jobId, context) {
                var dfd = $.Deferred();
                $.when(apiFunc(args, jobId, context))
                    .done(function (result, context) {
                        dfd.resolve(result, context);
                    })
                    .fail(function (errMsg, context) {
                        if (errMsg.substr(0, 6) == "FATAL:") {
                            dfd.reject(errMsg, true, context);
                        } else {
                            dfd.reject(errMsg, false, context);
                        }
                    });
                return dfd.promise();
            },

            getNodeData: function (id) {
                var node = this.nodeObjects[id];
                var action = App.PageController.actionToPerform;
                var path = (node["path"]) ? node["path"] : "unknown";
                var isCsv = path.slice(-3).toUpperCase() == "CSV";
                var skip = node["skip"] || isCsv;

                return {action: action, id: id, skip: skip, node: node}

            },
            processChunkAsync: function (apiFunc, jobId, nodeArray, result) {
                var dfd = $.Deferred();
                var that = this;

                if (nodeArray==null || typeof nodeArray=='undefined'){
                    dfd.reject("An unknown error has occurred. Please try again.")
                }

                async.forEach(nodeArray,
                    function (id, callback) {
                        var args = that.getNodeData(id);
                        var context = {node: args.node};
                        if (!args.skip) {
                            $.when(that.actionWrapper(apiFunc, args, jobId, context))
                                .done(function (successText, context) {
                                    that.processSuccessNode(context.node, successText);
                                    callback(null);
                                })
                                .fail(function (errMsg, fatal, context) {
                                    if (fatal) {
                                        callback(errMsg);
                                    } else {
                                        result.nonFatalErrors += 1;
                                        that.processErrorNode(context.node, errMsg);
                                        callback(null);
                                    }
                                });
                        }
                        else {
                            if (args.errMsg && args.errMsg.length) {
                                //do nothing, there is an error already shown that we should not cover up
                            } else {
                                that.processSkippedNode(id, "Skipped");
                            }
                            callback(null);
                        }
                    }, function (errMsg) {
                        if (errMsg) {
                            // this is a fatal error that will abort the whole process
                            dfd.reject(errMsg);
                        } else {
                            dfd.resolve(true);
                        }
                    });

                return dfd.promise();
            }

        }


    });
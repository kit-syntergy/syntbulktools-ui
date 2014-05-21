define(["jquery"],
    function ($) {
        /*global App*/
        /*global LL_URL*/

        var privObj = {
            mergeJsonObjects: function (obj1, obj2) {
                var obj3 = {};
                for (var attName in obj1) {
                    obj3[attName] = obj1[attName];
                }
                for (attName in obj2) {
                    obj3[attName] = obj2[attName];
                }
                return obj3;
            },
            ajaxToLL: function (method, func, dataParams, context, returnJqXhr) {
                if (!context) {
                    context = this;
                }
                var params = this.mergeJsonObjects({func: func}, dataParams);
                var dfd = $.Deferred();
                $.when($.ajax({type: method, url: LL_URL, data: params, context: context, dataType: 'json'}))
                    .done(function (retObj) {
                        dfd.resolve(privObj.parseLLResponse(retObj), context);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        if (returnJqXhr) {
                            dfd.reject(jqXHR, textStatus, errorThrown);
                        }
                        else {
                            // default the error response to take into account a non response from server (including stack trace)
                            var errMsg;
                            if (jqXHR.status == 500 || jqXHR.statusText == "Internal server error") {
                                errMsg = "Server did not respond. Check to see if server is running. If so, are there any trace files in the Content Server logs?"
                            }
                            else if (errorThrown.length > 5 && errorThrown.substr(0, 1) == "{") {
                                try {
                                    var errObj = $.parseJSON(errorThrown);
                                    errMsg = errObj.errMsg || "Unknown Server Error"
                                }
                                catch (e) {
                                    errMsg = "Invalid JSON response from server: " + errorThrown;
                                }
                            }
                            else if (jqXHR.responseText.length > 5 && jqXHR.responseText.substr(0, 1) == "{") {
                                try {
                                    var errObj = $.parseJSON(jqXHR.responseText);
                                    errMsg = errObj.errMsg || "Unknown Server Error"
                                }
                                catch (e) {
                                    errMsg = "Invalid JSON response from server: " + errorThrown;
                                }
                            }
                            else if (typeof errorThrown === 'string' && errorThrown.length) {
                                errMsg = errorThrown;
                            }
                            else {
                                errMsg = textStatus;
                            }
                            dfd.reject(errMsg, context);
                        }
                    });

                return dfd.promise();
            },
            postToLL: function (func, dataParams, context) {
                return this.ajaxToLL("POST", func, dataParams, context);
            },
            getFromLL: function (func, dataParams, context) {
                return this.ajaxToLL("GET", func, dataParams, context);
            },
            getFromLLjqXHR: function (func, dataParams, context) {
                var dfd = $.Deferred();
                if (!context) {
                    context = this;
                }
                var params = this.mergeJsonObjects({func: func}, dataParams);
                $.when($.ajax({ type: "POST",
                        url: LL_URL,
                        data: params,
                        context: context,
                        dataType: 'json'}))
                    .done(function (retObj) {
                        dfd.resolve(retObj);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        dfd.reject(jqXHR, textStatus, errorThrown);
                    });

                return dfd.promise();
            },
            parseLLResponse: function (retObj) {
                if (_.isObject(retObj)) {
                    // success response object is expected to have OK and result
                    if ((retObj.ok || retObj.OK) && retObj.hasOwnProperty("result")) {
                        return retObj.result;
                    }
                    else {
                        console.log("Invalid object response from LL: " + JSON.stringify(retObj));
                        return new Error("Invalid object response from LL: " + JSON.stringify(retObj));
                    }
                }
                else {
                    console.log("Invalid response from LL: " + retObj);
                    return new Error("Invalid response from LL: " + retObj);
                }
            }
        };

        return{
            /* ******   initialize functions */
            initializeProcess: function (action, colNames, optionStr, jobId, sourceSettings, context) {
                return privObj.postToLL("syntbt.initializeProcess", {action: action, colNames: colNames, optionStr: optionStr, jobId: jobId, sourceSettings: App.OScriptParser.toOScript(sourceSettings)}, context);
            },
            processItem: function (args, jobId, context) {
                // args is this args = {nodeData: nodeData, action: action, itemNo: itemNo}
                return privObj.postToLL("syntbt.processItem", {action: args.action, id: args.id, jobId: jobId}, context);
            },
            validateItem: function (args, jobId, context) {
                // args is this args = {nodeData: nodeData, action: action, itemNo: itemNo}
                return privObj.postToLL("syntbt.validateItem", {action: args.action, id: args.id, jobId: jobId}, context);
            },
            finalizeProcess: function (action, jobId, context) {
                return privObj.postToLL("syntbt.finalizeProcess", {action: action, jobId: jobId}, context);
            },

            // *** save scheduled job
            saveScheduledJob: function (type, subtype, optionStr, context) {
                return privObj.postToLL("syntbt.saveScheduledJob", {type: type, subtype: subtype, optionStr: optionStr}, context);
            },

            runAsyncJob: function (scheduleId, context) {
                return privObj.postToLL("syntbt.runAsyncJob", {scheduleId: scheduleId}, context);
            },

            // *** save profile
            saveProfile: function (type, subType, optionStr, model, context) {
                return privObj.postToLL("syntbt.saveProfile", {model: App.OScriptParser.toOScript(model), type: type, optionStr: optionStr, subType: subType}, context);
            },
            addProfile: function (type, subType, optionStr, context) {
                return privObj.postToLL("syntbt.addProfile", {type: type, optionStr: optionStr, subType: subType}, context);
            },

            /* get functions needed for UI */
            checkFilePath: function (filePath, context) {
                return privObj.postToLL("syntbt.checkFilePath", {filePath: filePath}, context);
            },
            checkFolderPath: function (folderPath, context) {
                return privObj.postToLL("syntbt.checkFolderPath", {folderPath: folderPath}, context);
            },
            getCsvColumns: function (filePath, context) {
                return privObj.postToLL("syntbt.getCsvColumns", {filepath: filePath}, context)
            },
            checkCsvSize: function (filePath, context) {
                return privObj.postToLL("syntbt.checkCsvSize", {filepath: filePath}, context)
            },
            getExportPaths: function (ExportPathModel, filter, forDataTable, context) {
                return privObj.getFromLL("syntbe.getExportPaths", {filter: App.OScriptParser.toOScript(filter), model: App.OScriptParser.toOScript(ExportPathModel), forDataTable: forDataTable}, context)
            },
            getExportProfiles: function (ExportProfileModel, filter, forDataTable, context) {
                return privObj.getFromLL("syntbe.getExportProfiles", {filter: App.OScriptParser.toOScript(filter), forDataTable: forDataTable}, context)
            },
            getLoadPaths: function (LoadPathModel, filter, forDataTable, context) {
                return privObj.getFromLL("syntbl.getLoadPaths", {filter: App.OScriptParser.toOScript(filter), model: App.OScriptParser.toOScript(LoadPathModel), forDataTable: forDataTable}, context)
            },
            getLoadProfiles: function (LoadProfileModel, filter, forDataTable, context) {
                return privObj.getFromLL("syntbl.getLoadProfiles", {filter: App.OScriptParser.toOScript(filter), forDataTable: forDataTable}, context)
            },

            getLoadJobs: function (LoadJobModel, forDataTable, context) {
                return privObj.getFromLL("syntbl.getLoadProfiles", {filter: App.OScriptParser.toOScript(filter), model: App.OScriptParser.toOScript(LoadProfileModel), forDataTable: forDataTable}, context)
            },

            getExportJobs: function (ExportJobModel, filter, forDataTable, context) {
                return privObj.getFromLL("syntbl.getLoadProfiles", {filter: App.OScriptParser.toOScript(filter), model: App.OScriptParser.toOScript(LoadProfileModel), forDataTable: forDataTable}, context)
            },

            getNodeTree: function (dataid, path, showFiles, doRecursive, context) {
                return privObj.getFromLL("syntbt.getNodeTree", {dataid: dataid, path: path, showFiles: showFiles, doRecursive: doRecursive}, context)
            },
            getGroupTree: function (groupId, path, showUsers, doRecursive, context) {
                return privObj.getFromLL("syntbt.getGroupTree", {groupId: groupId, path: path, showUsers: showUsers, doRecursive: doRecursive}, context)
            },
            getFileTree: function (filePath, doRecursive, showFiles, getMetadata, filterExtension, returnDirect, context) {
                return privObj.getFromLL("syntbt.getFileTree", {filepath: filePath, doRecursive: doRecursive, showFiles: showFiles, filterExtension: filterExtension, getMetadata: getMetadata, returnDirect: returnDirect}, context)
            },
            getNodeCount: function (path, dataid, context, includeRoot) {
                return privObj.getFromLL("syntbt.getNodeCount", {dataid: dataid, path: path, includeRoot: includeRoot}, context)
            },
            getUserGroupCount: function (groupId, context, includeRoot) {
                return privObj.getFromLL("syntbt.getUserGroupCount", {groupId: groupId, includeRoot: includeRoot}, context)
            },
            getFileCount: function (filePath, context, includeRoot) {
                return privObj.getFromLL("syntbt.getFileCount", {filepath: filePath, includeRoot: includeRoot}, context)
            },
            getJobStatusHtml: function(scheduleId, context){
                return privObj.getFromLL("syntbt.getJobStatusHtml", {scheduleId: scheduleId}, context);
            },
            getAvgTime: function(jobType, jobSubtype, context){
                return privObj.getFromLL("syntbt.getAvgTime", {jobType: jobType, jobSubtype: jobSubtype}, context);
            },
            getDataTableJqXHR: function (func, filter, model, fnCallback, fnErrorCallback, customCallback, context) {
                // params will come in like this
                //{type: "export", subType: "exportobjects"}
                App.PageController.showLoadingIndicator("Processing");
                $.when(privObj.getFromLLjqXHR(func, {forDataTable: true, filter: App.OScriptParser.toOScript(filter), model: App.OScriptParser.toOScript(model)}, context))
                    .done(function (retObj) {
                        //log(retObj);
                        fnCallback(privObj.parseLLResponse(retObj));
                        if (customCallback){
                            customCallback();
                        }
                        App.PageController.hideLoadingIndicator();
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        App.PageController.hideLoadingIndicator();
                        if (fnErrorCallback) {
                            fnErrorCallback(jqXHR, textStatus, errorThrown);
                        } else {
                            throw new Error(textStatus + ": " + errorThrown + " " + jqXHR.responseText);
                        }
                    });

            },
            getCsvTableJqXHR: function (func, colNames, filePath, fnCallback, fnErrorCallback, processDataFunc, startNo, displayLength, total, nodeObjects, sourceSettings, context) {
                // params will come in like this
                //{type: "export", subType: "exportobjects"}
                nodeObjects = nodeObjects ? nodeObjects : {};
                $.when(privObj.getFromLLjqXHR(func, {forDataTable: true, filePath: filePath, colNames: App.OScriptParser.toOScript(colNames), startNo: startNo, total: total, displayLength: displayLength, nodeObjects: App.OScriptParser.toOScript(nodeObjects), sourceSettings: App.OScriptParser.toOScript(sourceSettings)}, context))
                    .done(function (retObj) {
                        var result = privObj.parseLLResponse(retObj);
                        if (processDataFunc) {
                            processDataFunc(result.aaData);
                        }
                        try {
                            fnCallback(result);
                        } catch (e) {
                            // not sure what this error message means -- related to FixedColumns.  But it does not seem significant so I will not log it out
                            if (e.message != "Cannot read property 'parentNode' of null") {
                                log(e);
                            }
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        App.PageController.hideLoadingIndicator();
                        if (fnErrorCallback) {
                            fnErrorCallback(jqXHR, textStatus, errorThrown);
                        } else {
                            throw new Error(textStatus + ": " + errorThrown + " " + jqXHR.responseText);
                        }
                    });

            },

            /* crud data table function used for manage load paths, load jobs, etx */
            crudDataTableOperation: function (method, func, data, context) {
                return privObj.ajaxToLL(method, func, ({data: App.OScriptParser.toOScript(data)}), context, true)
            },

            searchUsers: function (term, context) {
                return privObj.getFromLL("syntbt.searchUsers", {searchTerm: term}, context)
            }

        }

    });

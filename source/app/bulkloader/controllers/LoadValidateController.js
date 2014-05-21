define(["ProcessController"],
    function (ProcessController) {
        /*global App*/
        return function () {
            var controller = Object.create(ProcessController);

            controller.runValidation = function (optionStr) {
                optionStr += "&validateOnly=true";
                var avg = 0.01;
                $.when(App.ServerAPI.getAvgTime($("#jobType").val(), $("#jobSubtype").val(), this))
                    .done(function (result) {
                        avg = result;
                    })
                    .fail(function (errMsg, context) {
                        log(errMsg)
                    });

                // Initialize this load
                $.when(controller.initializeLoadExport(optionStr, this, avg, true))
                    .done(function (result) {
                        controller.hasResultsToClear = true;
                        var progressBar = new App.PageController.ProgressBar("Validating Items", controller.totalNumItems);
                        controller.iterateNodes(controller.jobId, controller.validateSuccess, controller.fatalValidationError, controller.nonFatalValidationError, controller.nodeIdArray, progressBar, App.ServerAPI.validateItem);
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.runLoad = function (optionStr) {
                var avg = 0.01;
                $.when(App.ServerAPI.getAvgTime($("#jobType").val(), $("#jobSubtype").val(), this))
                    .done(function (result) {
                        avg = result;
                    })
                    .fail(function (errMsg, context) {
                        log(errMsg)
                    });


                // Initialize this load
                $.when(controller.initializeLoadExport(optionStr, this, avg, false))
                    .done(function (result) {
                        controller.hasResultsToClear = true;
                        var progressBar = new App.PageController.ProgressBar("Load Progress", controller.totalNumItems);
                        controller.iterateNodes(controller.jobId, controller.finalizeLoad, controller.fatalLoadError, controller.nonFatalLoadError, controller.nodeIdArray, progressBar, App.ServerAPI.processItem);
                    })
                    .fail(function (errMsg, context) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.finalizeLoad = function (showSuccess) {
                var dfd = $.Deferred();

                showSuccess = (typeof showSuccess == "undefined") ? true : false;
                App.PageController.showLoadingIndicator("Logging Results");

                $.when(App.ServerAPI.finalizeProcess(App.PageController.actionToPerform, App.ProcessController.jobId, this))
                    .done(function (result, context) {
                        App.PageController.hideLoadingIndicator();
                        if (showSuccess) {
                            App.ProcessController.loadSuccess(result);
                        }
                        dfd.resolve(result);
                    })
                    .fail(function (errMsg, context) {
                        App.PageController.hideLoadingIndicator();
                        App.PageController.showError(errMsg);
                        dfd.reject(errMsg)
                    })

                return dfd.promise()
            };

            controller.validateSuccess = function () {
                App.PageController.showSuccess("Validation completed with no errors.");
                App.PageController.hasValidationErrors = false;

            };

            controller.nonFatalValidationError = function (result) {
                App.PageController.hasValidationErrors = true;
                App.PageController.showInfo("There were " + result.nonFatalErrors + " errors. Hover over the Error indicator in the Source View for details. If you proceed with the load, these items will be skipped and saved to a separate 'error.csv' file.");
            };

            controller.nonFatalLoadError = function (result) {
                var msg = result["msg"] || "The load completed, but there were " + result.nonFatalErrors + " errors.  Errors have been logged to the '_audit' folder in the load directory.";

                $.when(controller.finalizeLoad())
                    .done(function (result, context) {
                        App.PageController.showInfo(msg += " You can also hover over the Error indicator in the Source View to see error messages.");
                    })
                    .fail(function (errMsg, context) {
                        // do nothing
                    })
            };

            controller.loadSuccess = function (result) {
                var msg = result["msg"] || "Load completed successfully. Results have been logged to the '_audit' folder in the load directory."
                App.PageController.showSuccess(msg);
                if (App.PageController.setTargetPath) {
                    App.PageController.setTargetPath(App.PageController.rootTargetId, App.PageController.rootTargetPath);
                }
            };

            controller.setInvalidForLoad = function () {
                // just set the jobId to 0
                controller.jobId = 0;
            };

            controller.fatalValidationError = function (err) {
                controller.setInvalidForLoad();
                App.PageController.showError(err);
            };

            controller.fatalLoadError = function (err) {
                App.PageController.showError(err);
                controller.setInvalidForLoad();
            };

            return controller;

        }
    });
define(["ProcessController"],
    function (ProcessController) {
        /*global App*/
        return function () {
            var controller = Object.create(ProcessController);

            controller.exportSuccess = function (result) {
                msg = result["msg"] || "Export completed successfully."
                App.PageController.showSuccess(msg);
                App.PageController.setRootExportPath(App.PageController.rootExportDir, false);
            };

            controller.exportError = function (err) {
                App.PageController.showError(err);
            };

            controller.nonFatalError = function (result) {
                // shouldn't be called for export
            };

            controller.runExport = function (optionStr) {
                var avg = 0.05;
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
                        App.PageController.setRootExportPath(result["rootTargetPath"], false);
                        if (controller.nodeIdArray && controller.nodeIdArray.length) {
                            var progressBar = new App.PageController.ProgressBar("Exporting Progress", controller.totalNumItems);
                            controller.iterateNodes(controller.jobId, controller.finalizeExport, controller.exportError, controller.nonFatalError, controller.nodeIdArray, progressBar, App.ServerAPI.processItem);
                        }
                        else {
                            controller.finalizeExport();
                        }
                    })
                    .fail(function (errMsg, context) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.finalizeExport = function () {
                App.PageController.showLoadingIndicator("Finalizing", true);

                $.when(App.ServerAPI.finalizeProcess(App.PageController.actionToPerform, controller.jobId, this))
                    .done(function (result, context) {
                        App.PageController.hideLoadingIndicator();
                        controller.exportSuccess(result);

                    })
                    .fail(function (errMsg, context) {
                        App.PageController.hideLoadingIndicator();
                        controller.exportError(errMsg);
                    })
            };

            return controller;
        }


    });
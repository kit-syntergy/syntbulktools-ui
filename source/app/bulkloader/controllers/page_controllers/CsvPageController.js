define(["jquery", "CsvParser", "BulkLoaderPageController", "LoadPathModel", "async", "jquery-cookie", "text!templates/browseSelect.html"],
    function ($, CsvParser, BulkLoaderPageController, LoadPathModel, async, JQueryCookie, browseSelectTemplate) {
        /*global App*/
        /*global log*/
        var controller = Object.create(BulkLoaderPageController);
        controller.loadfrom = "server";
        controller.hasCsvOpen = false;
        controller.rootFileLoc = "absolute";
        controller.modalSourcePathSelected = null;
        controller.pageType = "csv";
        controller.sourceModalTital = "Select a CSV File";
        controller.helpText = "Select a CSV file and then click 'Select'";
        controller.showSourceFilesSelect = true;
        controller.allowFolders = false;
        controller.colNames = [];

        controller.initPage = function (formVals, triggerChanges) {
            BulkLoaderPageController.initPage.call(this, formVals, triggerChanges);
            controller.hideGrid();
            App.DataTableController.initController();
            App.PageController.updatePage();

            $("#action").change(function (e) {
                e.preventDefault();
                var action = $("#action").val();
                App.PageController.actionToPerform = action;
                App.PageController.paramsChanged();
                App.PageController.handleActionChange(action);
            });
        };

        controller.handleActionChange = function (action) {
            // implemented in subclasses
        };

        controller.fineTuneOptions = function (colNames, dataFlags) {
            // implemented in subclasses
        };

        controller.openServerCsv = function (filePath, fineTuneOptions) {
            var controller = this;
            if (controller.isNow()) {
                this.showLoadingIndicator("Reading File");
                // *** check to make sure we are not over the limit
                $.when(App.ServerAPI.checkCsvSize(filePath))
                    .done(function (num) {
                        controller.setTotalNumItems(num);
                        if (controller.checkTotalNumItems(num)) {
                            $.when(App.ServerAPI.getCsvColumns(filePath))
                                .done(function (result) {
                                    if (fineTuneOptions) {
                                        App.PageController.fineTuneOptions(result["colNames"], result["dataFlags"]);
                                    }
                                    App.DataTableController.doServerCsv(num, filePath, result.colNames, function (result) {
                                        controller.gridLoadDone();

                                    }, function (jqXHR, textStatus, errorThrown) {
                                        controller.hideLoadingIndicator();
                                        controller.hasCsvOpen = false;
                                        controller.showError(errorThrown);
                                        App.PageController.updatePage();
                                    });
                                })
                                .fail(function (errMsg) {
                                    controller.hideLoadingIndicator();
                                    controller.showError(errMsg);
                                });

                        }
                    })
                    .fail(function (errMsg) {
                        controller.showError(errMsg);
                    });
            }
        };

        controller.gridLoadDone = function () {
            controller.hideLoadingIndicator();
            BulkLoaderPageController.gridLoadDone.call(this);
            controller.hasCsvOpen = true;
            App.PageController.updatePage();
            App.ProcessController.resetProcess(true);
        };

        controller.reloadGrid = function () {
            App.DataTableController.reset();
            this.openServerCsv($('#rootSourcePath').val());
        };

        controller.setRootSourcePath = function (path, triggerChanges) {
            $('#rootSourcePath').val(path);
            if (triggerChanges) {
                controller.openServerCsv(path, true);
            }
        };

        controller.sourceNodeModalActivate = function (node) {
            var path = node.data.path;
            controller.modalSourcePathSelected = path;
            if (App.PageController.allowFolders || controller.isCsvPath(path)) {
                controller.enableElement("selectButton");
            } else {
                controller.disableElement("selectButton");
            }
        };

        controller.sourcePathSelectClicked = function () {
            controller.closeModalWindow();
            controller.setRootSourcePath(controller.modalSourcePathSelected, true, true);
        };

        controller.clearDataTable = function () {
            App.DataTableController.clearDataTable();
            this.hasCsvOpen = false;
            this.hasResultsToClear = false;
        };

        controller.canEnableActionButtons = function () {
            return ((this.hasCsvOpen || this.isScheduled()) && this.actionToPerform != null && this.actionToPerform != "") && ((this.rootFileLoc != null && this.rootFileLoc != "") || $("#myfile").val().length)
        };

        controller.updatePage = function (totalNumChanged) {
            BulkLoaderPageController.updatePage.call(this, totalNumChanged);
        };

        controller.processWhenChange = function () {
            BulkLoaderPageController.processWhenChange.call(this);
            var when = $("input:radio[name=whenOption]:checked").val();

            switch (when) {
                case "now":
                    $("#rootSourcePathLabel").html('CSV File');
                    App.PageController.allowFolders = false;
                    break;
                case "async":
                    $("#rootSourcePathLabel").html('CSV File or Folder with CSV files');
                    App.PageController.allowFolders = true;
                    break;
            }
            App.PageController.handleActionChange(App.PageController.actionToPerform);
        };
        return controller;

    });
define(["jquery", "RootPageController", "ExportPathModel"],
    function ($, RootPageController, ExportPathModel) {
        return function () {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Export Path");
                App.DataTableController.setApiFuncs("syntbe.getExportPaths", "syntbe.addEditExportPath", "syntbe.addEditExportPath", "syntbe.removeExportPath");
                App.DataTableController.initController(ExportPathModel, true);
            };


            return controller;
        };
    });
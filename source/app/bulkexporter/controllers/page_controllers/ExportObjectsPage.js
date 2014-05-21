define(["jquery", "lodash", "BulkExporterPageController", "jquery-cookie", "ExportPathModel", "text!templates/browseSelect.html"],
    function ($, _, BulkExporterPageController, JQueryCookie, ExportPathModel, browseSelectTemplate) {
        /*global App*/
        /*global LL_URL*/
        return function () {
            var controller = Object.create(BulkExporterPageController);
            controller.pageType = "objects";

            controller.initPage = function (formVals, triggerChanges) {
                BulkExporterPageController.initPage.call(this, formVals, triggerChanges);

            };

            return controller;
        };
    });
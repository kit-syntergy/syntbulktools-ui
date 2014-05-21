define(["jquery", "BulkExporterPageController"],
    function ($, BulkExporterPageController) {
        return function () {
            var controller = Object.create(BulkExporterPageController);
            controller.initPage = function (formVals, triggerChanges) {
                BulkExporterPageController.initPage.call(this, formVals, triggerChanges);
            };

            return controller;
        }
    });
define(["jquery", "BulkLoaderPageController"],
    function ($, BulkLoaderPageController) {
        return function () {
            var controller = Object.create(BulkLoaderPageController);
            controller.initPage = function (formVals, triggerChanges) {
                BulkLoaderPageController.initPage.call(this, formVals, triggerChanges);
            };

            return controller;
        }
    });
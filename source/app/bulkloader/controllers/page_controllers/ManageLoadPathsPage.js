define(["jquery", "RootPageController", "LoadPathModel"],
    function ($, RootPageController, LoadPathModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Load Path");
                App.DataTableController.setApiFuncs("syntbl.getLoadPaths","syntbl.addEditLoadPath", "syntbl.addEditLoadPath", "syntbl.removeLoadPath");
                App.DataTableController.initController(LoadPathModel, true);
            };

            controller.setBrowsePath = function (path) {

            };


            return controller;
        };
   });
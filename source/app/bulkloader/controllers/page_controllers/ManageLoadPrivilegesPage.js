define(["jquery", "RootPageController", "LoadPrivilegeModel"],
    function ($, RootPageController, LoadPrivilegeModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("User");
                App.DataTableController.setApiFuncs("syntbl.getLoadUsers","syntbl.addEditLoadUser", "syntbl.addEditLoadUser", "syntbl.removeLoadUser");
                App.DataTableController.initController(LoadPrivilegeModel, true, null, true, 'userName');
            };


            return controller;
        };
   });
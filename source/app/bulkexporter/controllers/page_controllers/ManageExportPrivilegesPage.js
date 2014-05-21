define(["jquery", "RootPageController", "ExportPrivilegeModel"],
    function ($, RootPageController, ExportPrivilegeModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("User");
                App.DataTableController.setApiFuncs("syntbe.getExportUsers","syntbe.addEditExportUser", "syntbe.addEditExportUser", "syntbe.removeExportUser");
                App.DataTableController.initController(ExportPrivilegeModel, true, null, true, 'userName');
            };


            return controller;
        };
   });
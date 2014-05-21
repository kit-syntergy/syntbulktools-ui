define(["jquery", "RootPageController", "ExportProfileModel"],
    function ($, RootPageController, ExportProfileModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Export Profile");
                App.DataTableController.setApiFuncs("syntbe.getExportProfiles","syntbe.addEditExportProfile", "syntbe.addEditExportProfile", "syntbe.removeExportProfile");
                App.DataTableController.initController(ExportProfileModel, false, null, null, 'profileId');
            };


            return controller;
        };
   });
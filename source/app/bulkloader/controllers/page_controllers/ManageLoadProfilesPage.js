define(["jquery", "RootPageController", "LoadProfileModel"],
    function ($, RootPageController, LoadProfileModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Load Profile");
                App.DataTableController.setApiFuncs("syntbl.getLoadProfiles","syntbl.addEditLoadProfile", "syntbl.addEditLoadProfile", "syntbl.removeLoadProfile");
                App.DataTableController.initController(LoadProfileModel, false, null, null, 'profileId');
            };


            return controller;
        };
   });
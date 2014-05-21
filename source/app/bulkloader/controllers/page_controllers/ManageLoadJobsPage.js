define(["jquery", "RootPageController", "LoadJobModel"],
    function ($, RootPageController, LoadJobModel) {
        return function () {
            /*global App*/
            /*global LL_URL*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Load Job");
                App.DataTableController.setApiFuncs("syntbl.getLoadJobs", "syntbl.addEditLoadJob", "syntbl.addEditLoadJob", "syntbl.removeLoadJob");

                // *** on switch page, make sure we clear out any real time updating from jobs page
                _.each(App.intervalIds, function (intervalId) {
                    window.clearInterval(intervalId);
                    App.log("cleared intervalId " + intervalId)
                });
                App.intervalIds = [];

                App.DataTableController.initController(LoadJobModel, false, {jobtype: 'load'}, false, 'scheduleId', controller.updateJobStatus)
            };


            return controller;
        };
    });
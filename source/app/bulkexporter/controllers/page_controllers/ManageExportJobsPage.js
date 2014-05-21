define(["jquery", "RootPageController", "ExportJobModel"],
    function ($, RootPageController, ExportJobModel) {
        return function() {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.initPage = function (formVals, triggerChanges) {
                RootPageController.initPage.call(this, formVals, triggerChanges);
                App.DataTableController.setObjectName("Export Job");
                App.DataTableController.setApiFuncs("syntbe.getExportJobs","syntbe.addEditExportJob", "syntbe.addEditExportJob", "syntbe.removeExportJob");

                // *** on switch page, make sure we clear out any real time updating from jobs page
                _.each(App.intervalIds, function (intervalId) {
                    window.clearInterval(intervalId);
                    App.log("cleared intervalId " + intervalId)
                });
                App.intervalIds = [];


                App.DataTableController.initController(ExportJobModel, false, {jobtype: 'export'}, false, 'scheduleId', controller.updateJobStatus);
            };


            return controller;
        };
   });
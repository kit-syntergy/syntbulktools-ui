define(["jquery", "RootPageController", "lodash"],
    function ($, RootPageController, _) {
        return function () {
            /*global App*/
            var controller = Object.create(RootPageController);

            controller.formName = "scheduleForm";

            controller.initPage = function () {
                var that = this;
                $("#schedule_type").change(function (e) {
                    that.updatePage("#schedule_type");
                });

                $('#day_pattern').change(function (e) {
                    that.updatePage("#day_pattern");
                });

                $('#daily_frequency').change(function (e) {
                    that.updatePage('#daily_frequency');
                });

                $("#schedule_form input, select").change(function (e) {
                    controller.tryEnableButton();
                });

                $("#scheduleButton").click(function (e) {
                    e.preventDefault();
                    controller.saveScheduledJob();
                });

                var now = new Date();
                var oneTimeDateVal = $('#one_time_date').val();
                var oneTimeTimeVal = $('#one_time_time').val();

                if (controller.isNow()) {
                    var dateStr = this.getDateStrFromDate(now);
                    $('#one_time_date').val(dateStr);
                }

                if (controller.isNow()) {
                    var timeStr = this.getTimeStrFromDate(now);
                    $('#one_time_time').val(timeStr);
                }

                this.tryEnableButton();

                this.updatePage();

            };

            controller.getTimeStrFromDate = function (d) {
                var hours = ("0" + d.getHours()).slice(-2);
                var minutes = ("0" + d.getMinutes()).slice(-2);
                var seconds = ("0" + d.getSeconds()).slice(-2);
                return hours + ":" + minutes + ":" + seconds;
            };

            controller.getDateStrFromDate = function (d) {
                var day = ("0" + d.getDate()).slice(-2);
                var month = ("0" + (d.getMonth() + 1)).slice(-2);
                return d.getFullYear() + "-" + (month) + "-" + (day);
            };

            controller.tryEnableButton = function () {
                var jobName = $('#jobname').val();
                var jobDesc = $('#jobdesc').val();
                if (App.PageController.canEnableActionButtons() && jobName && jobName.length && jobDesc && jobDesc.length) {
                    controller.enableElement('scheduleButton');
                }
                else {
                    controller.disableElement('scheduleButton');
                }
            };

            controller.updatePage = function (id) {
                var val;
                // schedule type
                if (typeof id == "undefined" || id == "#schedule_type") {
                    val = $("#schedule_type").val();
                    switch (val) {
                        case '1':
                            controller.hideElement("recurringFieldset");
                            controller.showElement("oneTimeFieldset");
                            break;
                        case  '2':
                            controller.hideElement("oneTimeFieldset");
                            controller.showElement("recurringFieldset");
                            break;
                    }
                }

                if (typeof id == "undefined" || id == "#day_pattern") {
                    val = $('#day_pattern').val();
                    switch (val) {
                        case '1':      // every x days
                            controller.hideElement("certainDaysGroup");
                            controller.showElement("recursEveryGroup");
                            break;
                        case  '2':     // on certain days
                            controller.hideElement("recursEveryGroup");
                            controller.showElement("certainDaysGroup");
                            break;
                    }
                }

                if (typeof id == "undefined" || id == "#daily_frequency") {
                    // daily frequency type
                    val = $('#daily_frequency').val();
                    switch (val) {
                        case '1':      // once during the day
                            controller.hideElement("DailyEveryXGroup");
                            controller.showElement("OnceDailyAtGroup");
                            break;
                        case  '2':     // at regular intervals during day
                            controller.hideElement("OnceDailyAtGroup");
                            controller.showElement("DailyEveryXGroup");
                            break;
                    }
                }
            };

            controller.openSchedulerForm = function () {
                $("#scheduleDiv").accordion({
                    collapsible: true,
                    active: true,
                    heightStyle: 'content',
                    active: 0
                });

                //$("#scheduleDiv").accordion('activate',0);
                //var current = $accordion.accordion("option", "active"),
                //maximum = $accordion.find("h4").length,
                //next = current + 1 === maximum ? 0 : current + 1;
                //$accordion.accordion("activate", 1);
            };


            controller.saveScheduledJob = function () {
                var type = $('#jobType').val();
                var subType = $('#jobSubtype').val();
                var optionStr = App.PageController.serializeFormVals(true);
                $.when(App.ServerAPI.saveScheduledJob(type, subType, optionStr, this))
                    .done(function (result) {
                        $("#scheduleId").val(result["scheduleId"]);
                        controller.showSuccess("The job has been saved. Monitor the status of your job in the 'Manage " + controller.initCap(type) + " Jobs page");
                    })
                    .fail(function (errMsg) {
                        controller.showError(errMsg);
                    })
            };


            return controller;

        };
    }
)
;
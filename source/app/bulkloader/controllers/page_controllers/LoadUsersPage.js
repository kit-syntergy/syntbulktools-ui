define(["CsvPageController"],
    function (CsvPageController) {
        /*global App*/
        /*global LL_URL*/
        return function () {
            var controller = Object.create(CsvPageController);
            controller.actionToPerform = "createusergroup";

            controller.initPage = function (formVals, triggerChanges) {
                CsvPageController.initPage.call(this, formVals, triggerChanges);

                // initialize action to "create" (first item in the pulldown)
                controller.handleActionChange('createusergroup');

                if (typeof formVals !== "undefined" && formVals["rootSourcePath"]) {
                    var val = formVals["rootSourcePath"];
                    controller.openServerCsv(val);
                }
            };

            controller.handleActionChange = function (action) {
                controller.hideShowNameConflictDiv(action);
                controller.hideShowMemberUpdateDiv(action);
                controller.hideShowMemberAddDiv(action);

            };

            controller.hideShowNameConflictDiv = function (action) {
                if (action == "createusergroup") {
                    controller.showElement("nameCollisionFieldset");
                } else {
                    controller.hideElement("nameCollisionFieldset");
                }
            };

            controller.hideShowMemberUpdateDiv = function (action) {
                if (action == "createusergroup") {
                    controller.hideElement("updateMembersControlGroup");
                } else {
                    controller.showElement("updateMembersControlGroup");
                }
            };

            controller.hideShowMemberAddDiv = function (action) {
                if (action == "createusergroup") {
                    controller.showElement("addMembersControlGroup");
                } else {
                    controller.hideElement("addMembersControlGroup");
                }
            };

            return controller;
        };
    });
define(["CsvPageController"],
    function (CsvPageController) {
        /*global App*/
        /*global log*/
        return function () {

            var controller = Object.create(CsvPageController);
            controller.hasDataFlags = false;
            controller.hasPermData = false;

            controller.initPage = function (formVals, triggerChanges) {
                var controller = this;
                CsvPageController.initPage.call(this, formVals, triggerChanges);

                // do all the accordion elements
                $("#metadataOptionsDiv").accordion({
                    active: false,
                    collapsible: true,
                    heightStyle: 'content'
                });

                controller.showElement("containerOptionDiv");
                /*
                 $("#myfile").change(function (e) {
                 try {
                 controller.handleFileSelect(e);
                 }
                 catch (e) {
                 controller.showError(e);
                 $("#myfile").val('');
                 }
                 });
                 */
                $("#autoCreateFolders").click(function (e) {
                    controller.updatePage()
                });

                $('input[type="radio"][name="sourceOption"]').click(function (e) {
                    controller.switchSource(e.target.value);
                    controller.paramsChanged();
                });

                require(["customfile"], function (customfile) {
                    if (this.customFile == null) {
                        this.customFile = $('input[type=file]').customFile();
                    }
                });

                $("#rootFileLoc").change(function (e) {
                    controller.rootFileLoc = $("#rootFileLoc").val();
                    controller.paramsChanged();
                });

                if (typeof formVals !== "undefined" && formVals["rootSourcePath"]) {
                    var val = formVals["rootSourcePath"];
                    controller.openServerCsv(val);
                }

                // initialize action to "create" (first item in the pulldown)
                controller.handleActionChange('create');
            };

            controller.handleActionChange = function (action) {
                controller.hideShowNameConflictDiv(action);
                controller.hideShowAdvancedOptions(action);
                controller.hideShowAddVersionOptions(action);
                controller.hideShowFileLocOptions(action);
                controller.hideShowMetadataOptions(action);
                controller.hideShowPermsOption(action);
            };

            controller.hideShowFileLocOptions = function (action) {
                if (action == "addversion" || action == "create") {
                    controller.showElement("rootFileLocControl");
                }
                else {
                    controller.hideElement("rootFileLocControl");
                }
            };

            controller.hideShowAddVersionOptions = function (action) {
                if (action == "addversion") {
                    controller.showElement("addVersionControlGroup");
                }
                else {
                    controller.hideElement("addVersionControlGroup");
                }
            };
            controller.hideShowNameConflictDiv = function (action) {
                if (action == "create" || action == "move") {
                    controller.showElement("nameCollisionFieldset");

                    if (action == "move") {
                        $(".addVersionOption").hide();
                        $("input [name='docOption']").prop('checked', false);
                        $("#docReportErrors").prop('checked', true);
                        $(".updateMetadataOption").hide();
                        $("input [name='containerOption']").prop('checked', false);
                        $("#containerReportErrors").prop('checked', true);

                    } else {
                        $(".addVersionOption").show();
                        $(".updateMetadataOption").show();
                    }

                } else {
                    controller.hideElement("nameCollisionFieldset");
                }
            };

            controller.fineTuneOptions = function (colNames, dataFlags) {
                controller.hasDataFlags = true;
                controller.hasPermData = dataFlags["hasPermData"];
                if (App.ArrayUtils(colNames).contains("$NewParentId", true) || App.ArrayUtils(colNames).contains("$NewTargetPath", true)) {
                    $("#action").val("move");
                    controller.actionToPerform = "move";
                }
                if (App.ArrayUtils(colNames).contains("$ObjectId", true)) {
                    //if (App.ArrayUtils(colNames).contains("$Permissions", true)) {
                    //$("#action").val("perms");
                    //controller.actionToPerform = "perms";
                    //} else {
                    $("#action").val("update");
                    controller.actionToPerform = "update";
                    //}
                } else {
                    $("#action").val("create");
                    controller.actionToPerform = "create";
                }
                controller.handleActionChange(controller.actionToPerform);
                controller.adjustMetadataOptions(controller.actionToPerform, dataFlags);
            };

            controller.hideShowPermsOption = function (action) {
                var when = $("input:radio[name=whenOption]:checked").val();
                if (action != "perms" && action != "addversion" && (controller.hasPermData || when == "async")) {
                    controller.showElement("setPermsControlGroup");
                    $('#setPerms').prop('checked', true);
                }
                else {
                    controller.hideElement("setPermsControlGroup");
                    $('#setPerms').prop('checked', false);
                }
            };

            controller.hideShowMetadataOptions = function (action) {
                var when = $("input:radio[name=whenOption]:checked").val();
                if ((action == "update" || action == "create") && (controller.hasDataFlags || when == "async")) {
                    controller.showElement("metadataOptionsControlGroup");
                } else {
                    controller.hideElement("metadataOptionsControlGroup");
                    $('#mdCats').prop('checked', false);
                    $('#mdClass').prop('checked', false);
                    $('#mdDapi').prop('checked', false);
                    $('#mdName').prop('checked', false);
                    $('#mdNickname').prop('checked', false);
                    $('#mdOwner').prop('checked', false);
                    $('#mdPo').prop('checked', false);
                    $('#mdRm').prop('checked', false);
                }
            };

            controller.adjustMetadataOptions = function (action, d) {
                if (d["hasAttrData"]) {
                    controller.enableElement('mdCats');
                    $('#mdCats').prop('checked', true);
                    $("#mdCatsLabel").css("color", "");
                } else {
                    controller.disableElement('mdCats');
                    $("#mdCatsLabel").css("color", "#d3d3d3");
                    $('#mdCats').prop('checked', false);
                }
                if (d["hasClassification"]) {
                    controller.enableElement('mdClass');
                    $("#mdClassLabel").css("color", "");
                    $('#mdClass').prop('checked', true);
                } else {
                    controller.disableElement('mdClass');
                    $("#mdClassLabel").css("color", "#d3d3d3");
                    $('#mdClass').prop('checked', false);
                }
                if (d["hasDapiNodeData"]) {
                    controller.enableElement('mdDapi');
                    $("#mdDapiLabel").css("color", "");
                    $("#mdDapiHelp").css("color", "");
                    $('#mdDapi').prop('checked', true);
                } else {
                    controller.disableElement('updateNode');
                    $("#mdDapiLabel").css("color", "#d3d3d3");
                    $("#mdDapiHelp").css("color", "#d3d3d3");
                    $('#mdDapi').prop('checked', false);
                }
                if (d["hasNewName"]) {
                    controller.enableElement('mdName');
                    $("#mdNameLabel").css("color", "");
                    $('#mdName').prop('checked', true);
                } else {
                    $("#mdNameLabel").css("color", "#d3d3d3");
                    controller.disableElement('mdName');
                    $('#mdName').prop('checked', false);
                }
                if (d["hasNickName"]) {
                    controller.enableElement('mdNickname');
                    $("#mdNicknameLabel").css("color", "");
                    $('#mdNickname').prop('checked', true);
                } else {
                    $("#mdNicknameLabel").css("color", "#d3d3d3");
                    controller.disableElement('mdNickname');
                    $('#mdNickname').prop('checked', false);
                }
                if (d["hasOwnerData"]) {
                    $("#mdOwner").css("color", "");
                    controller.enableElement('mdOwner');
                    $('#mdOwner').prop('checked', true);
                } else {
                    $("#mdOwnerLabel").css("color", "#d3d3d3");
                    controller.disableElement('mdOwner');
                    $('#mdOwner').prop('checked', false);
                }
                if (d["hasPhysObjData"]) {
                    $("#mdPoLabel").css("color", "");
                    controller.enableElement('mdPo');
                    $('#mdPo').prop('checked', true);
                } else {
                    $("#mdPoLabel").css("color", "#d3d3d3");
                    controller.disableElement('mdPo');
                    $('#mdPo').prop('checked', false);
                }
                if (d["hasRecManData"]) {
                    $("#mdRmLabel").css("color", "");
                    controller.enableElement('mdRm');
                    $('#mdRm').prop('checked', true);
                } else {
                    $("#mdRmLabel").css("color", "#d3d3d3");
                    controller.disableElement('mdRm');
                    $('#mdRm').prop('checked', false);
                }
            };


            controller.updatePage = function (totalNumChanged) {
                CsvPageController.updatePage.call(this, totalNumChanged);
                // root path control?
                if (this.actionToPerform == "update") {
                    controller.hideElement("rootFileLocControl");
                }
                else {
                    controller.showElement("rootFileLocControl");
                }
                if ($("#autoCreateFolders").prop("checked")) {
                    $("input[name='containerOption']").prop('disabled', true);
                    $("#containerUpdateMetadataOption").prop('disabled', false);
                    $("#containerUpdateMetadataOption").prop('checked', true);
                }
                else {
                    $("input[name='containerOption']").prop('disabled', false);
                }
            };

            return controller;
        }
    })
;
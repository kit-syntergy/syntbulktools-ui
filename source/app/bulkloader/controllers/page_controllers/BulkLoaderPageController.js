define(["jquery", "RootPageController", "jquery-ui", "lodash", "LoadPathModel", "LoadProfileModel", "text!bulkloader/templates/browse_loadpath_select.html", "TreeController", "ContentServerAPI"],
    function ($, RootPageController, jQueryUI, _, LoadPathModel, LoadProfileModel, browseSelectTemplate, TreeController, ServerAPI) {
        /*global App*/
        var controller = Object.create(RootPageController);
        controller.filePath = '';
        controller.modalSourcePathSelected = null;
        controller.modalTargetPathSelected = null;
        controller.modalTargetIdSelected = null;
        controller.actionToPerform = "create";
        controller.rootSourcePath = null;
        controller.rootTargetPath = null;
        controller.rootTargetId = null;

        controller.getHiddenCols = function (rawColNames) {
            return []
        };

        controller.initPage = function (formVals, triggerChanges) {
            RootPageController.initPage.call(this, formVals, triggerChanges);

            controller.profileModel = LoadProfileModel;

            // generic callback to set paramsChanged for all advanced inputs
            $("#myform_adv input[type='radio'], input[type='checkbox']").change(function (e) {
                controller.paramsChanged();
            });

            $("#validateButton").click(function (e) {
                e.preventDefault();
                controller.validateButtonClicked();
            });

            $("#loadButton").click(function (e) {
                e.preventDefault();
                controller.loadButtonClicked();

            });

            $("#useFileCreateDate").click(function (e) {
                if ($("#useFileCreateDate").prop('checked')) {
                    $("#useFileModifyDate").prop('checked', false);
                }
            });

            $("#useFileModifyDate").click(function (e) {
                if ($("#useFileModifyDate").prop('checked')) {
                    $("#useFileCreateDate").prop('checked', false);
                }
            });

            $("#selectSourcePathButton").click(function (evt) {
                App.SourcePathSelectController = new TreeController("treeDiv_select", "myModal");
                var html = Handlebars.compile(browseSelectTemplate)({help_block: App.PageController.helpText});
                controller.openModalWindow(html, App.PageController.sourceModalTital, true, null, null, "auto", "auto");
                $("#selectButton").click(function (e) {
                    e.preventDefault();
                    App.PageController.sourcePathSelectClicked();
                });
                controller.setSelectOptions(LoadPathModel, "path", "path", "startPath", App.ServerAPI.getLoadPaths, {}, true, null);

                $("#startPath").change(function (evt) {
                    controller.paramsChanged();
                    var path = $("#startPath").val();
                    if (path.length) {
                        controller.folderPath = path;
                        var filterExtension = App.PageController.pageType == "csv" ? "csv" : null;
                        App.SourcePathSelectController.loadFileTreeSelect(path, App.PageController.showSourceFilesSelect, App.PageController.sourceNodeModalActivate, filterExtension);
                    }
                });
            });

            controller.setSelectOptions(LoadProfileModel, "profileId", "profileId", "profileId", App.ServerAPI.getLoadProfiles, {jobSubtype: $('#jobSubtype').val()}, false,
                function () {
                    $("#profileId").combobox();
                    $("#toggle").click(function () {
                        $("#profileId").toggle()
                    });
                    controller.showElement("myform");
                    //$("span.custom-combobox").show();
                });

        };

        controller.validateButtonClicked = function () {
            App.ProcessController.runValidation(App.PageController.serializeFormVals());
        }

        controller.loadButtonClicked = function () {
            App.ProcessController.runLoad(App.PageController.serializeFormVals());
        }

        controller.hideShowAdvancedOptions = function (action) {
            // *** initially hide all of the items
            $('div.advanced_settings > label').hide();

            // now show just the ones for this action
            $('div.advanced_settings > label.bl_' + action).show();
        };

        controller.paramsChanged = function () {
            App.ProcessController.setInvalidForLoad()
        };

        controller.updatePage = function (totalNumChanged) {
            RootPageController.updatePage.call(this, totalNumChanged);
        };

        return controller;
    });
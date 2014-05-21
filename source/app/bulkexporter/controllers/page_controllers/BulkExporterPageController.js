define(["jquery", "lodash", "RootPageController", "BulkExporterPageController", "jquery-cookie", "ExportPathModel", "ExportProfileModel", "text!templates/browseSelect.html", "text!bulkexporter/templates/browse_exportpath_select.html", "TreeController"],
    function ($, _, RootPageController, BulkExporterPageController, JQueryCookie, ExportPathModel, ExportProfileModel, browseSelectTemplate, browseExportPathTemplate, TreeController) {
        /*global App*/
        var controller = Object.create(RootPageController);
        controller.currentSourceId = null;
        controller.modalSourcePathSelected = null;
        controller.modalTargetPathSelected = null;
        controller.rootExportDir = null;
        controller.rootSourceId = null;
        controller.actionToPerform = "exportnodes";
        controller.sourceModalTital = "Select a Root Export Folder";
        controller.rootNode = null;
        controller.helpText = "Select a folder from the tree and then click 'Select'";

        controller.getHiddenCols = function (rawColNames) {
            return []
        };

        controller.initPage = function (formVals, triggerChanges) {
            RootPageController.initPage.call(this, formVals, triggerChanges);

            controller.profileModel = ExportProfileModel;

            $("#exportButton").click(function (e) {
                e.preventDefault();
                App.ProcessController.runExport(App.PageController.serializeFormVals());
            });

            $('input:radio[name=exportType]').click(function (e) {
                controller.updatePage();
            });

            // do all the accordion elements
            $("#optionsDiv").accordion({
                collapsible: true,
                active: false,
                heightStyle: 'content'
            });

            $("#dataToExportDiv").accordion({
                collapsible: true,
                active: false,
                heightStyle: 'content'
            });

            $("#wantFilesOnly").change(function (e) {
                if (this.checked) {
                    $("#flatRadio").prop("checked", true);
                    $("#hierarchyRadio").prop("checked", false);
                    controller.disableElement("hierarchyRadio");
                    $("input:radio[name=numMetadataFiles]").val(['single']);
                    controller.disableElement("multipleCSVRadio");
                }
                else {
                    controller.enableElement("hierarchyRadio");
                    controller.enableElement("multipleCSVRadio");
                }
            });

            $("#selectExportPathButton").click(function (evt) {
                    App.TargetPathSelectController = new TreeController("treeDiv_select", "myModal");
                    var html = Handlebars.compile(browseExportPathTemplate)({help_block: App.PageController.helpText});
                    controller.openModalWindow(html, App.PageController.sourceModalTital, true, null, null, "auto", "auto");
                    $('#selectButton').click(function (e) {
                        e.preventDefault();
                        App.PageController.targetPathSelectClicked();
                    });
                    controller.setSelectOptions(ExportPathModel, "path", "path", "startPath", App.ServerAPI.getExportPaths, {}, true, null);
                    $("#startPath").change(function (evt) {
                        var path = $("#startPath").val();
                        if (path.length) {
                            App.TargetPathSelectController.loadFileTreeSelect(path, false, App.PageController.targetNodeModalActivate, null);
                        }
                    });
                }
            )
            ;

            controller.setSelectOptions(ExportProfileModel, "profileId", "profileId", "profileId", App.ServerAPI.getExportProfiles, {jobSubtype: $('#jobSubtype').val()}, false,
                function () {
                    $("#profileId").combobox();
                    $("#toggle").click(function () {
                        $("#profileId").toggle()
                    });
                    controller.showElement("myform");
                    //$("span.custom-combobox").show();
                });

            $("#selectSourcePathButton").click(function (evt) {
                controller.openModalWindow('<div id="myModal"><img class="progress-img"></div>', null, true, "modal_progress_indicator_div", false);
                App.SourcePathSelectController = new TreeController("treeDiv_select", "myModal");
                App.SourcePathSelectController.loadLLTreeInModal(2000, "Enterprise", browseSelectTemplate, "Select Source Container", false, controller.sourceNodeModalActivate, controller.sourcePathSelectClicked);
            });

            controller.hideShowAdvancedOptions();
            controller.updatePage();
        };

        controller.hideShowAdvancedOptions = function () {
            // *** initially hide all of the items
            $('div.advanced_settings > label').hide();

            // *** show the options for this pageType (either "csv" or "structure"
            $('div.advanced_settings > label.be_' + App.PageController.pageType).show();

            // *** initially hide all of the items
            $('#dataToExportSubDiv').find('> label').hide();

            // *** show the options for this pageType (either "csv" or "structure"
            $('#dataToExportSubDiv').find('> label.be_' + App.PageController.pageType).show();

            // *** initially hide all of the items
            $('#optionsSubDiv').find('> div').hide();

            // *** show the options for this pageType (either "csv" or "structure"
            $('#optionsSubDiv').find('> div.be_' + App.PageController.pageType).show();
        };

        controller.gridExportDone = function () {
            $("#grid_div").removeClass("hideBorder");
            this.showElement("grid_div");
            this.updatePage();
        };

        controller.canEnableActionButtons = function () {
            var rootExportPath = $('#rootExportPath');
            return (rootExportPath.val() && rootExportPath.val().length && $('#rootSourcePath').val().length && controller.rootExportDir !== null)
        };

        controller.updatePage = function (totalNumChanged) {
            RootPageController.updatePage.call(this, totalNumChanged);
            var exportType = $("input:radio[name=exportType]:checked").val();
            if (exportType === 'flat') {
                $("input:radio[name=numMetadataFiles]").val(['single']);
                this.disableElement("multipleCSVRadio");
            }
            else {
                this.enableElement("multipleCSVRadio");
            }
        };
        controller.sourcePathSelectClicked = function () {
            if (controller.modalSourcePathSelected) {
                controller.closeModalWindow();
                controller.setRootSourcePath(controller.modalSourcePathSelected, controller.currentSourceId);
            }
        };

        controller.targetPathSelectClicked = function () {
            if (controller.modalTargetPathSelected) {
                controller.closeModalWindow();
                controller.setRootExportPath(controller.modalTargetPathSelected, true);
            }
        };

        controller.setRootSourcePath = function (path, dataId) {
            dataId = dataId === true || dataId === false ? undefined : dataId;
            $('#rootSourceId').val(dataId);
            $('#rootSourcePath').val(path);

            // *** check to make sure we are not over the limit
            $.when(App.ServerAPI.getNodeCount(path, dataId, false))
                .done(function (num) {
                    if (controller.checkTotalNumItems(num)) {
                        controller.setTotalNumItems(num);
                        controller.updatePage(true);
                        controller.showLoadingIndicator("Processing");
                        App.SourceTreeController.loadLLTree(dataId, path, true, false, null, [
                            {title: "Export From Here", cmd: "setsource"},
                            {title: "Refresh", cmd: "setsource"},
                            {title: "Exclude this node from the Export", cmd: "skipnode"},
                            {title: "Include this node from the Export", cmd: "includenode"}
                        ], function () {
                            controller.hideLoadingIndicator();
                            controller.rootNode = App.SourceTreeController.getRootNode();
                        });
                    }
                })
                .fail(function (errMsg) {
                    controller.showError(errMsg);
                });
        };

        controller.setRootExportPath = function (path, updateInput) {
            updateInput = typeof updateInput == "undefined" ? true : updateInput;
            App.TargetViewController.loadFileTree(path, true, false, false, null, [
                {title: "Set as Target Folder", cmd: "setexportdir"},
                {title: "Refresh", cmd: "setexportdir"},
                {title: "Load from Here", cmd: "loadfromhere"}
            ], true, function () {
                // do nothing
            });
            if (updateInput) {
                $('#rootExportPath').val(path);
            }
            controller.rootExportDir = path;
            controller.updatePage();
        };

        controller.contextMenuCmd = function (cmd, node) {
            switch (cmd) {
                case '#setexportdir':
                    controller.setRootExportPath(node.data.path, false);
                    break;
                case '#loadfromhere':
                    if (controller.isUserCsv(node.data.path)) {
                        var formVals = {rootSourcePath: node.data.path};
                        controller.forwardToPage("bulkloader", "loadusers", formVals, true);
                    }
                    else if (controller.isCsvPath(node.data.path)) {
                        var formVals = {rootSourcePath: node.data.path};
                        controller.forwardToPage("bulkloader", "loadcsv", formVals, true);
                    }
                    else if (controller.isFolderPath(node.data.path)) {
                        var formVals = {rootSourcePath: $("#rootSourcePath").val(), rootSourcePath: node.data.path};
                        controller.forwardToPage("bulkloader", "loadfolderstructure", formVals, true);
                    }
                    else {
                        controller.showError("You need to select either a CSV file or folder to load from.");
                    }
                    break;
                case '#setsource':
                    controller.setRootSourcePath(node.data.path, node.data.dataid);
                    break;
                case '#skipnode':
                    if (node.data.skip) {
                        controller.showInfo("This node is already marked for exclusion.");
                    }
                    else {
                        App.SourceTreeController.skipNode(node);
                    }
                    break;
                case '#includenode':
                    if (node.data.skip) {
                        App.SourceTreeController.includeNode(node);
                    }
                    else {
                        controller.showInfo("This node is already included in the load");
                    }
                    break;
            }
        };

        controller.sourceNodeModalActivate = function (node) {
            controller.enableElement("selectButton");
            controller.currentSourceId = node.data.dataid;
            controller.modalSourcePathSelected = node.data.path;
        };

        controller.targetNodeModalActivate = function (node) {
            controller.enableElement("selectButton");
            controller.modalTargetPathSelected = node.data.path;
        };

        return controller;
    })
;
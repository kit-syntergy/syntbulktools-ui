define(["jquery", "lodash", "BulkLoaderPageController", "jquery-cookie", "text!templates/browseSelect.html", "handlebars", "TreeController"],
    function ($, _, BulkLoaderPageController, JQueryCookie, browseSelectTemplate, Handlebars, TreeController) {
        /*global App*/
        /*global LL_URL*/
        return function () {
            var controller = Object.create(BulkLoaderPageController);
            controller.pageType = "structure";
            controller.sourceModalTital = "Select Load Directory";
            controller.showSourceFilesSelect = false;
            controller.helpText = "Select a folder and then click 'Select'";

            controller.initPage = function (formVals, triggerChanges) {
                BulkLoaderPageController.initPage.call(this, formVals, triggerChanges);

                // *** set load paths
                // *** load content into the modal
                //var progressHtml = '<div id="myModal"><img class="progress-img"></div>';

                $("#selectTargetPathButton").click(function (evt) {
                    controller.openModalWindow('<div id="myModal"><img class="progress-img"></div>', null, true, "modal_progress_indicator_div", false);
                    App.TargetPathSelectController = new TreeController("treeDiv_select", "myModal");
                    App.TargetPathSelectController.loadLLTreeInModal(2000, "Enterprise", browseSelectTemplate, "Select Target Folder", false, controller.targetNodeModalActivate, controller.targetPathSelectClicked);
                });

                // default in a target of enterprise if it wasn't already brought into the form
                if (typeof formVals === "undefined" || !formVals["rootTargetPath"]) {
                    controller.setTargetPath(2000, "Enterprise", false);
                }

                // initialize action to "create" (first item in the pulldown)
                controller.hideShowAdvancedOptions('create');

            };

            controller.canEnableActionButtons = function () {
                return ($('#rootTargetPath').val().length && $('#rootSourcePath').val().length && this.actionToPerform != null);
            };

            controller.updatePage = function () {
                BulkLoaderPageController.updatePage.call(this);
            };

            controller.sourcePathSelectClicked = function () {
                controller.closeModalWindow();
                controller.setRootSourcePath(this.modalSourcePathSelected);
            };

            controller.targetPathSelectClicked = function () {
                controller.closeModalWindow();
                controller.setTargetPath(controller.modalTargetIdSelected, controller.modalTargetPathSelected, true);
            };

            controller.hideShowAdvancedOptions = function (action) {
                // hide all
                $('div.advanced_settings > label').hide();

                // now just show ones for folder structure load
                $('div.advanced_settings > label.bl_structure').show();
            };

            controller.setRootSourcePath = function (path) {
                $('#rootSourcePath').val(path);
                controller.paramsChanged();

                // *** check to make sure we are not over the limit
                $.when(App.ServerAPI.getFileCount(path, false))
                    .done(function (num) {
                        if (controller.checkTotalNumItems(num)) {
                            controller.showLoadingIndicator("Processing");
                            controller.setTotalNumItems(num);
                            controller.updatePage(true);
                            App.SourceTreeController.loadFileTree(path, true, false, false, null, [
                                //{title: "View Metadata", cmd: "viewmetadata"},
                                {title: "Load from here", cmd: "setloaddir"},
                                {title: "Refresh", cmd: "setloaddir"},
                                {title: "Show file path", cmd: "showfilepath"},
                                {title: "Exclude this node from the Load", cmd: "skipnode"},
                                {title: "Include this node in the load", cmd: "includenode"}
                            ], false, function () {
                                controller.hideLoadingIndicator();
                            });
                        }
                    })
                    .fail(function (errMsg) {
                        controller.showError(errMsg);
                    });
            };

            controller.setTargetPath = function (dataId, path, doUpdate) {
                $('#rootTargetPath').val(path);
                controller.rootTargetId = dataId;
                controller.rootTargetPath = path;
                App.TargetViewController.loadLLTree(dataId, path, true, false, null, [
                    {title: "Set as Target Container", cmd: "settarget"},
                    {title: "Refresh", cmd: "settarget"}
                ]);
                if (doUpdate) {
                    controller.paramsChanged();
                    controller.updatePage();
                }
            };

            controller.sourceNodeModalActivate = function (node) {
                controller.enableElement("selectButton");
                controller.modalSourcePathSelected = node.data.path;
            };

            controller.targetNodeModalActivate = function (node) {
                controller.enableElement("selectButton");
                controller.modalTargetIdSelected = node.data.dataid;
                controller.modalTargetPathSelected = node.data.path;
            };

            controller.contextMenuCmd = function (cmd, node) {
                switch (cmd) {
                    case '#setloaddir':
                        controller.setRootSourcePath(node.data.path);
                        break;
                    case '#settarget':
                        controller.setTargetPath(node.data.dataid, node.data.path, true);
                        break;
                    case '#viewmetadata':
                        controller.showMetadata(node.data.path, node.data.metadata);
                        break;
                    case '#showfilepath':
                        controller.showInfo(node.data.path);
                        //window.open("file://" + node.data.path);
                        break;
                    case '#skipnode':
                        if (node.data.skip) {
                            controller.showInfo("This node is already marked for exclusion.");
                        }
                        else {
                            controller.paramsChanged();
                            App.SourceTreeController.skipNode(node);
                        }
                        break;
                    case '#includenode':
                        if (node.data.skip) {
                            controller.paramsChanged();
                            App.SourceTreeController.includeNode(node);
                        }
                        else {
                            controller.showInfo("This node is already included in the load");
                        }
                        break;
                }
            };

            controller.showMetadata = function (path, metadata) {
                if (!metadata) {
                    App.PageController.showError("No metadata found for " + path);
                    // clear the table
                    App.DataTableController.clearDataTable();
                    return;
                }
                var data = metadata.data;
                var colNames = metadata.colNames;
                if (colNames.length) {
                    // *** have to do this twice to get columns to line up
                    App.DataTableController.receiveDataFromDesktop(colNames, data, false);
                    if (data.length > 1) {
                        $("#gridPopupDiv").dialog(
                            { autoOpen: true, width: 900, height: 600 }
                        );
                        App.DataTableController.refreshColumns(data);
                    } else {
                        var editor = App.DataTableController.editor;
                        editor.edit(
                            $("#grid").find("> tbody > tr")[0],
                            'View Metadata'/*,
                             { "label": "Update", "fn": function () {
                             editor.submit()
                             } }*/
                        );
                    }
                }
                else {
                    App.PageController.showError("No metadata found for " + path);
                    // clear the table
                    App.DataTableController.clearDataTable();
                }
            };

            return controller;
        };
    });
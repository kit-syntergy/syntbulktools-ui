define(["jquery", "lodash", "BulkExporterPageController", "jquery-cookie", "ExportPathModel", "text!templates/browseSelect.html", "TreeController"],
    function ($, _, BulkExporterPageController, JQueryCookie, ExportPathModel, browseSelectTemplate, TreeController) {
        /*global App*/
        /*global LL_URL*/
        return function () {
            var controller = Object.create(BulkExporterPageController);
            controller.pageType = "users";
            controller.actionToPerform = "exportusers";

            controller.initPage = function (formVals, triggerChanges) {
                BulkExporterPageController.initPage.call(this, formVals, triggerChanges);

                $("#selectSourcePathButton").unbind();

                $("#selectSourcePathButton").click(function (evt) {
                    controller.openModalWindow('<div id="myModal"><img class="progress-img"></div>', null, true, "modal_progress_indicator_div", false);
                    App.SourcePathSelectController = new TreeController("treeDiv_select", "myModal");
                    App.SourcePathSelectController.loadGroupTreeInModal(0, '', browseSelectTemplate, "Select Root Group", false, controller.sourceNodeModalActivate, controller.sourcePathSelectClicked);
                });

                $(".includeCheckbox").click(function (evt) {
                    controller.updatePage(false);
                });

                controller.updatePage(false);
            };

            controller.updatePage = function (totalNumChanged) {
                BulkExporterPageController.updatePage.call(this, totalNumChanged);
                if ($("#includeMembership").prop("checked")) {
                    $("#includeGroups").prop("checked", true);
                    $("#includeUsers").prop("checked", true);
                    $(".includeUgLabel").css("color", "gray");
                }
                else {
                    $(".includeUgLabel").css("color", "#000000");
                }
            };


            controller.sourceNodeModalActivate = function (node) {
                if (node.data.isGroup) {
                    controller.enableElement("selectButton");
                } else {
                    controller.disableElement("selectButton");
                }
                controller.currentSourceId = node.data.id;
                controller.modalSourcePathSelected = node.data.path;
            };

            controller.sourcePathSelectClicked = function () {
                if (controller.modalSourcePathSelected) {
                    controller.closeModalWindow();
                    controller.setRootSourcePath(controller.modalSourcePathSelected, controller.currentSourceId);
                }
            };

            controller.setRootSourcePath = function (path, groupId) {
                groupId = groupId === true || groupId === false ? undefined : groupId;
                $('#rootSourceId').val(groupId);
                $('#rootSourcePath').val(path);

                // *** check to make sure we are not over the limit
                $.when(App.ServerAPI.getUserGroupCount(groupId, false))
                    .done(function (num) {
                        if (controller.checkTotalNumItems(num)) {
                            controller.setTotalNumItems(num);
                            controller.updatePage(true);
                            controller.showLoadingIndicator("Processing");
                            App.SourceTreeController.loadGroupTree(groupId, path, true, false, null, [
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
                        controller.setRootSourcePath(node.data.path, node.data.id);
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

            return controller;
        };
    });
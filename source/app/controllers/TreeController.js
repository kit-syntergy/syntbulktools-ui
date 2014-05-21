define(["jquery", "lodash", "dynatree", "async", "contextMenu"],
    function ($, _, dynatree, async, contextMenu) {
        /*global App*/
        /*global LL_URL*/
        /*global mod_img*/
        return function (treeDivId, modalDivId) {
            var controller = {};
            controller.tree = null;
            controller.treeDivId = treeDivId;
            controller.modalDivId = modalDivId;
            controller.loadType = "fileStructure";

            controller.loadLLTree = function (dataid, path, showFiles, doRecursive, nodeActivateFunc, contextMenuOptions, callback) {
                $.when(App.ServerAPI.getNodeTree(dataid, path, showFiles, doRecursive))
                    .done(function (data) {
                        controller.showTree([data], showFiles, false, nodeActivateFunc, contextMenuOptions, null);
                        App.PageController.showElement(controller.treeDivId);
                        if (callback)callback();
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                        if (callback)callback();
                    });
            };

            controller.loadFileTree = function (filepath, showFiles, doRecursive, getMetadata, nodeActivateFunc, contextMenuOptions, createPath, callback) {
                $.when(App.ServerAPI.getFileTree(filepath, doRecursive, showFiles, getMetadata))
                    .done(function (data) {
                        controller.showTree([data], showFiles, getMetadata, nodeActivateFunc, contextMenuOptions, null);
                        App.PageController.showElement(controller.treeDivId);
                        if (callback) callback();
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.loadGroupTree = function (groupId, path, showUsers, doRecursive, nodeActivateFunc, contextMenuOptions, callback) {
                $.when(App.ServerAPI.getGroupTree(groupId, path, showUsers, doRecursive))
                    .done(function (data) {
                        controller.showTree([data], showUsers, false, nodeActivateFunc, contextMenuOptions, null);
                        App.PageController.showElement(controller.treeDivId);
                        if (callback)callback();
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                        if (callback)callback();
                    });
            };

            controller.loadGroupTreeInModal = function (groupId, path, html, title, showUsers, nodeActivateFunc, selectButtonFunc) {
                var doRecursive = false;
                $.when(App.ServerAPI.getGroupTree(groupId, path, showUsers, doRecursive))
                    .done(function (data) {
                        controller.showTreeInModal([data], html, title, nodeActivateFunc, true, true, selectButtonFunc);
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.loadLLTreeInModal = function (dataid, path, html, title, showFiles, nodeActivateFunc, selectButtonFunc) {
                var doRecursive = false;
                $.when(App.ServerAPI.getNodeTree(dataid, path, showFiles, doRecursive))
                    .done(function (data) {
                        controller.showTreeInModal([data], html, title, nodeActivateFunc, true, true, selectButtonFunc);
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.loadFileTreeSelect = function (filepath, showFiles, nodeActivateFunc, filterExtension, callback) {
                var doRecursive = false;
                var getMetadata = false;
                $.when(App.ServerAPI.getFileTree(filepath, doRecursive, showFiles, getMetadata, filterExtension))
                    .done(function (data) {
                        App.PageController.showElement(controller.treeDivId);
                        controller.showTree([data], showFiles, getMetadata, nodeActivateFunc, [], filterExtension);
                        if (callback) callback();
                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            };

            controller.showTree = function (children, showFiles, getMetadata, nodeActivateFunc, contextMenuOptions, filterExtension) {
                if (controller.tree) {
                    var dynaRoot = controller.getDynaRoot();
                    if (dynaRoot) {
                        dynaRoot.removeChildren();
                        _.each(children, function (child) {
                            dynaRoot.addChild(child);
                        }, this)
                    }
                } else {
                    controller.tree = $("#" + controller.treeDivId).dynatree({
                        onActivate: function (treeNode) {
                            if (nodeActivateFunc) {
                                nodeActivateFunc(treeNode);
                            }
                        },
                        children: children,
                        onLazyRead: function (treeNode) {
                            if (treeNode.data.id) {
                                treeNode.appendAjax({url: LL_URL,
                                    data: {"func": "syntbt.getGroupTree",
                                        "groupId": treeNode.data.id,
                                        "path": treeNode.data.path,
                                        "showUsers": showFiles,
                                        "doRecursive": false,
                                        "returnDirect": true
                                    }
                                });
                            }
                            else if (treeNode.data.dataid) {
                                treeNode.appendAjax({url: LL_URL,
                                    data: {"func": "syntbt.getNodeTree",
                                        "dataid": treeNode.data.dataid,
                                        "path": treeNode.data.path,
                                        "showFiles": showFiles,
                                        "doRecursive": false,
                                        "returnDirect": true
                                    }
                                });
                            } else if (treeNode.data.path) {
                                treeNode.appendAjax({url: LL_URL,
                                    data: {"func": "syntbt.getFileTree",
                                        "filepath": treeNode.data.path,
                                        "getMetadata": getMetadata,
                                        "showFiles": showFiles,
                                        "doRecursive": false,
                                        "returnDirect": true,
                                        "filterExtension": filterExtension
                                    }
                                });
                            }
                        },
                        debugLevel: 0
                    });
                    if (contextMenuOptions) {
                        controller.contextMenuActivate(contextMenuOptions);
                    }
                }
            };

            controller.showTreeInModal = function (children, html, title, nodeActivateFunc, showFiles, replaceModalHtml, selectButtonFunc) {
                if (replaceModalHtml) {
                    App.PageController.updateModalWindow(controller.modalDivId, html, title, 'auto', '300px');
                }
                $('#selectButton').click(function (e) {
                    e.preventDefault();
                    selectButtonFunc();
                });

                controller.showTree(children, showFiles, false, nodeActivateFunc, null, null);
                App.PageController.showElement(controller.treeDivId);
            };

            controller.getTree = function () {
                return $("#" + controller.treeDivId).dynatree("getTree");
            };

            controller.getDynaRoot = function () {
                return $("#" + controller.treeDivId).dynatree("getRoot");
            };

            controller.getRootNode = function () {
                // for our purposes, the root treeNode is actually the 1st child of dynatree root
                return controller.getDynaRoot().getChildren()[0];
            };

            controller.contextMenuActivate = function (menuOptions) {
                //Enable the context menu for all treeNode titles
                $("#" + controller.treeDivId).contextmenu({
                    delegate: ".dynatree-title",
                    //	menu: "#menu",
                    menu: menuOptions,
                    select: function (event, ui) {
                        var cmd = ui.item.find(">a").attr("href");
                        var target = ui.target;
                        var treeNode = $.ui.dynatree.getNode(target);
                        if (treeNode) {
                            treeNode.activate();
                            App.PageController.contextMenuCmd(cmd, treeNode);
                        }
                    }
                });
            };

            controller.skipNode = function (treeNode) {
                treeNode.data.skip = true;
                treeNode.data.icon = mod_img + "images/exclude_icon.png";
                treeNode.data.tooltip = "Skipped";
                $(treeNode.li).addClass("skippedNode");
                treeNode.data.addClass = "skippedNode";
                treeNode.render();
                App.ProcessController.skipNode(treeNode.data.id, treeNode.data.path);
                _.each(treeNode.getChildren(), function (child) {
                    controller.skipNode(child);
                });
            };

            controller.includeNode = function (treeNode) {
                treeNode.data.icon = null;
                treeNode.data.skip = false;
                treeNode.data.tooltip = "";
                $(treeNode.li).removeClass("skippedNode");
                treeNode.data.addClass = "";
                treeNode.render();
                App.ProcessController.includeNode(treeNode.data.id, treeNode.data.path);
                _.each(treeNode.getChildren(), function (child) {
                    controller.includeNode(child);
                });
            };

            controller.getTreeNodeFromPath = function (treeNode, path, expandLazyNodes) {
                var foundNode = null;

                if (treeNode.data.path === path) {
                    return treeNode;
                }
                _.any(controller.getChildren(treeNode, expandLazyNodes), function (child) {
                    if (child.data.path === path) {
                        foundNode = child;
                        return true;
                    } else {
                        if (child.data.isFolder && path.indexOf(child.data["path"]) >= 0) {
                            foundNode = controller.getTreeNodeFromPath(child, path, expandLazyNodes);
                            if (foundNode) {
                                return true;
                            }
                        }
                    }
                });
                return foundNode;
            };

            controller.getChildren = function (treeNode, expandLazyNodes) {
                var children = treeNode.getChildren(treeNode);
                if (typeof children === "undefined" && expandLazyNodes && treeNode.isLazy()) {
                    treeNode.reloadChildren(function (treeNode, isOk) {
                        children = isOk ? treeNode.getChildren() : []
                    });
                }
                return children;
            };

            controller.showSuccessNode = function (id, path, text) {
                /*
                 var treeNode = controller.getTreeNodeFromPath(controller.getRootNode(), path, true);
                 if (treeNode){
                 // *** put a green checkbox to show success
                 treeNode.data.icon = mod_img + "images/green_checkbox.png";
                 treeNode.data.tooltip = null;
                 treeNode.addClass = '';
                 treeNode.render();
                 }
                 */
                // do nothing for successes
            };

            controller.showSkippedNode = function (id, path, text) {
                // do nothing
            };

            controller.showErrorNode = function (id, path, err) {
                var treeNode = controller.getTreeNodeFromPath(controller.getRootNode(), path, false);
                if (treeNode) {
                    // *** put an error flag into the treeNode's data
                    treeNode.data.icon = mod_img + "images/exclamation_red.png";
                    treeNode.data.tooltip = err;
                    var parent = treeNode.getParent();
                    if (parent) {
                        $(parent.li).addClass("errorTreeNode");
                        parent.expand(true);
                        parent.render();
                    }
                    treeNode.expand(true);
                    treeNode.render();
                }
            };

            controller.clearNode = function (id, path) {
                if (path) {
                    var treeNode = controller.getTreeNodeFromPath(controller.getRootNode(), path, true);
                    if (treeNode) {
                        // *** remove error flag and tooltip
                        treeNode.data.icon = null;
                        treeNode.data.tooltip = null;
                        treeNode.addClass = "";
                        treeNode.render();
                    }
                }
            };

            controller.clearResults = function (errorNodes) {
                _.each(errorNodes, function (node) {
                    controller.clearNode(node["id"], node["path"]);
                }, this);
            };

            controller.redraw = function () {
                // do nothing
            };

            controller.getSourceSettings = function () {
                return {hiddenCols: [], findReplaceVals: {}, pushDownVals: {}};
            };

            return controller;
        }
    })
;
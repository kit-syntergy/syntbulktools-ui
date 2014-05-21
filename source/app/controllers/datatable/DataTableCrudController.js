define(["AbstractDataTableController"],
    function (AbstractDataTableController) {
        /*global App */
        /*global LL_URL*/
        return function () {

            var controller = Object.create(AbstractDataTableController);

            controller.dataTableFunc = null;
            controller.model = null;
            controller.objectName = "Row";
            controller.addFunc = null;
            controller.openFunc = null;
            controller.editFunc = null;
            controller.removeFunc = null;
            controller.filter = {};
            controller.useEditor = true;
            controller.idSrc = 'id';
            controller.customCallback = null;

            controller.setObjectName = function (name) {
                controller.objectName = name;
            };

            controller.setApiFuncs = function (dataTableFunc, createFunc, editFunc, removeFunc) {
                this.dataTableFunc = dataTableFunc;
                this.createFunc = createFunc;
                this.editFunc = editFunc;
                this.removeFunc = removeFunc;
            };

            controller.initController = function (model, addButton, filter, useEditor, idSrc, callback) {
                if (filter) {
                    controller.filter = filter;
                }
                if (typeof useEditor != "undefined" && useEditor != null) {
                    controller.useEditor = useEditor;
                }
                if (idSrc) {
                    this.idSrc = idSrc;
                }
                this.model = model;
                this.dgEditorFields = model.dgEditorFields;
                this.dgColumnDefs = model.dgColumnDefs;
                this.colNames = model.colNames;

                /* Custom user field type
                $.fn.DataTable.Editor.fieldTypes.user = $.extend(true, {}, $.fn.DataTable.Editor.models.fieldType, {
                    "create": function (conf) {
                        var that = this;

                        conf._enabled = true;

                        // Create the elements to use for the input
                        conf._input = $('<input type="text" class="userInput" id="userName" name="name">')[0];

                         return conf._input;
                    }
                });
                */

                if (callback){
                    this.customCallback = callback;
                }

                this.setupEditor(addButton);
                this.drawDataTable(true, addButton);
            };

            controller.getFuncAndData = function (data) {
                var o = {};
                switch (data.action) {
                    case "create":
                        o.func = controller.createFunc;
                        o.data = data.data;
                        break;

                    case "edit":
                        o.func = controller.editFunc;
                        o.data = data.data;
                        break;

                    case "remove":
                        o.func = controller.removeFunc;
                        o.data = {};
                        o.data[controller.idSrc] = data.data[0];
                        break;

                    default:
                        o.func = "invalid func"
                }
                return o;
            };

            controller.setupEditor = function (addButton) {
                this.editor = new $.fn.dataTable.Editor({
                    "height": "500px",
                    "ajaxUrl": LL_URL,
                    "domTable": controller.gridId,
                    "idSrc": controller.idSrc,
                    "onSubmitError": controller.onSubmitError,
                    "ajax": function (method, url, data, successCallback, errorCallback) {
                        var o = controller.getFuncAndData(data);
                        $.when(App.ServerAPI.crudDataTableOperation(method, o.func, o.data))
                            .done(function (json) {
                                successCallback(json);
                                controller.drawDataTable(true, addButton);
                            })
                            .fail(function (xhr, error, thrown) {
                                App.PageController.showError(thrown);
                                errorCallback(xhr, error, thrown);
                            });
                    }
                });
                // add the fields
                this.editor.add(
                    controller.dgEditorFields
                );
            };

            controller.successCallback = function (data) {
            };

            controller.onSubmitError = function (jqXHR, textStatus, errorThrown) {
                App.PageController.showError(textStatus + ": " + errorThrown + " " + jqXHR.responseText);
            };

            controller.errorCallback = function (jqXHR, textStatus, errorThrown) {
                App.PageController.showError(errorThrown);
            };

            controller.drawDataTable = function (doClearFirst, addButton) {
                if (doClearFirst) {
                    this.clearDataTable();
                }
                this.dataTable = $(controller.gridId).dataTable({
                        //"sDom": "THFfrtip",
                        "sDom": addButton ? "<'row-fluid'<'span12'T>>t<'row-fluid'<'span6'i><'span6'p>>" : "t<'row-fluid'<'span6'i><'span6'p>>",
                        "aoColumnDefs": controller.dgColumnDefs,
                        "bDestroy": true,
                        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
                            oSettings.jqXHR = App.ServerAPI.getDataTableJqXHR(controller.dataTableFunc, controller.filter, controller.model, fnCallback, controller.errorCallback, controller.customCallback)
                        },
                        "bServerSide": true,
                        "bPaginate": false,
                        "bFilter": false,
                        "bInfo": false,
                        "oLanguage": {
                            "sEmptyTable": "",
                            "sZeroRecords": ""
                        },
                        "bJQueryUI": true,
                        "oTableTools": addButton ? {"aButtons": [
                            { "sExtends": "editor_create", "editor": controller.editor, "sButtonText": "Add " + controller.objectName}//,
                            //{ "sExtends": "editor_edit", "editor": controller.editor, "sButtonText": "Edit " + controller.objectName},
                            //{ "sExtends": "editor_remove", "editor": controller.editor, "sButtonText": "Delete " + controller.objectName}
                        ]} : null
                    }
                );
                $('a.editor_create').on('click', function (e) {
                    e.preventDefault();
                    this.editor.create(
                        'Add New User',
                        {
                            "label": "Add",
                            "fn": function () {
                                controller.editor.submit()
                            }
                        }
                    );
                });

                controller.split = function (val) {
                    return val.split(/,\s*/);
                };
                controller.extractLast = function (term) {
                    return controller.split(term).pop();
                };
                // Add record
                $('a.DTTT_button').on('click', function (e) {
                    e.preventDefault();
                    $("#DTE_Field_userName")
                        // don't navigate away from the field on tab when selecting an item
                        .bind("keydown", function (event) {
                            if (event.keyCode === $.ui.keyCode.TAB &&
                                $(this).data("ui-autocomplete").menu.active) {
                                event.preventDefault();
                            }
                        })
                        .autocomplete({
                            source: function (request, response) {
                                $.when(App.ServerAPI.searchUsers(request.term))
                                    .done(function (results) {
                                        response(results);
                                    })
                                    .fail(function (errMsg) {
                                        App.PageController.showError(errMsg);
                                    });

                            },
                            minLength: 2,
                            select: function (event, ui) {
                                if(ui.item){
                                    $("#userName").val(ui.item.value);
                                }
                            },
                            open: function () {
                                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                            },
                            close: function () {
                                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                            },
                            delay: 500 })

                });

                // Edit record
                $(this.gridId).on('click', 'a.editor_edit', function (e) {
                    e.preventDefault();
                    var row = $(this).parents('tr')[0];
                    controller.editor.edit(
                        row,
                        'Edit record',
                        { "label": "Update", "fn": function () {
                            controller.editor.submit()
                        } }
                    );
                });


                // Edit Job
                $(this.gridId).on('click', 'a.editor_editjob', function (e) {
                    e.preventDefault();
                    var row = $(this).parents('tr')[0];
                    var data = controller.dataTable.fnGetData(row);
                    switch (data.jobType.toLowerCase()) {
                        case 'load':
                            App.PageController.forwardToPage("bulkloader", data["jobSubtype"].toLowerCase(), data);
                            break;

                        case 'export':
                            App.PageController.forwardToPage("bulkexporter", data["jobSubtype"].toLowerCase(), data);
                            break;
                    }
                });

                // Edit Profile
                $(this.gridId).on('click', 'a.editor_editprofile', function (e) {
                    e.preventDefault();
                    var row = $(this).parents('tr')[0];
                    var data = controller.dataTable.fnGetData(row);
                    switch (data["jobType"].toLowerCase()) {
                        case 'load':
                            App.PageController.forwardToPage("bulkloader", data["jobSubtype"].toLowerCase(), data);
                            break;

                        case 'export':
                            App.PageController.forwardToPage("bulkexporter", data["jobSubtype"].toLowerCase(), data);
                            break;
                    }
                });

                // Delete a record with confirmation
                $(this.gridId).on('click', 'a.editor_remove', function (e) {
                    e.preventDefault();
                    var row = $(this).parents('tr')[0];
                    controller.editor.message("Are you sure you want to remove this " + controller.objectName + "?");
                    controller.editor.remove(
                        row,
                        'Delete ' + controller.objectName, {
                            "label": "Confirm",
                            "fn": function () {
                                this.submit();
                            }
                        });
                });

                $(this.gridId).on('click', 'a.editor_run_now', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var row = $(this).parents('tr')[0];
                    var data = controller.dataTable.fnGetData(row);
                    var scheduleId = data[controller.idSrc];
                    $.when(App.ServerAPI.runAsyncJob(scheduleId))
                        .done(function (result) {
                            App.PageController.showSuccess("The job is now scheduled to run immediately. It should be picked up within the next 5 minutes.");
                            controller.drawDataTable(true)
                        })
                        .fail(function (errMsg) {
                            App.PageController.showError(errMsg);
                        });

                });

            };
            return controller;
        }


    })
;


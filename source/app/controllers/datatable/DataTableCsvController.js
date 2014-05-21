define(["AbstractDataTableController", "async", "scroller", "jeditable", "tabletools", "fixedColumns", "DataTableUtils"],
    function (AbstractDataTableController, async, scroller, jEditable, tableTools, fixedColumns, DataTableUtils) {
        /*global App */
        /*global LL_URL*/
        return function () {
            var controller = Object.create(AbstractDataTableController);
            controller.loadType = "csv";
            controller.nodeData = null;
            controller.csvPath = null;
            controller.totalNumItems = 0;
            controller.colNames = [];
            controller.hiddenCols = [];
            controller.pushDownVals = {};
            controller.findReplaceVals = {};
            controller.startNo = 1;
            controller.endNo = 10;
            controller.localStorageName = 'dataTableCsv';
            controller.statusColVals = {};

            controller.initController = function (options) {
                AbstractDataTableController.initController.call(this);

                // Create or update the localStorage entry
                if (!localStorage.getItem(this.localStorageName)) {
                    localStorage.setItem(this.localStorageName, '[]');
                }
                else {
                    // Loop over the array, removing any nulls from previous deletes on init
                    var a = JSON.parse(localStorage.getItem(controller.localStorageName));
                    for (var i = a.length - 1; i >= 0; i--) {
                        if (a[i] === null) {
                            a.splice(i, 1);
                        }
                    }
                    localStorage.setItem(this.localStorageName, JSON.stringify(a));
                }

                controller.useTableTools = !(options && options.noTableTools);

                controller.filter = !(options && options.noFilter);

                controller.columnHighlighting = options && options.columnHighlighting;

                // Set the classes that TableTools uses to something suitable for Bootstrap
                $.extend(true, $.fn.DataTable.TableTools.classes, {
                    "container": "btn-group",
                    "buttons": {
                        "normal": "btn",
                        "disabled": "btn disabled"
                    },
                    "collection": {
                        "container": "DTTT_dropdown dropdown-menu",
                        "buttons": {
                            "normal": "",
                            "disabled": "disabled"
                        }
                    }
                });

                TableTools.BUTTONS.ourbutton = $.extend(true, TableTools.buttonBase, {
                    "sNewLine": "<br>",
                    "sButtonClass": "btn-small",
                    "sDiv": ""
                });

                $.fn.dataTableExt.oApi.fnProcessingIndicator = function (oSettings, onoff) {
                    if (typeof( onoff ) == 'undefined') {
                        onoff = true;
                    }
                    this.oApi._fnProcessingDisplay(oSettings, onoff);
                };

                $.fn.dataTableExt.oApi.fnVisibleToColumnIndex = function (oSettings, iMatch) {
                    return oSettings.oApi._fnVisibleToColumnIndex(oSettings, iMatch);
                };

            };

            controller.setupEditor = function (idSrc) {
                this.editor = new $.fn.dataTable.Editor({
                    "domTable": "#grid",
                    "fields": this.dgEditorFields,
                    "idSrc": idSrc,
                    "ajax": function (method, url, data, successCallback, errorCallback) {
                        var id = null;
                        var store = JSON.parse(localStorage.getItem(controller.localStorageName));
                        if (data.action === 'create') {
                            var o = controller.setFieldsForAdd(store, data.data);
                            store.push(o);
                            id = 'row_' + (store.length - 1);
                        }
                        else if (data.action === 'edit') {
                            var index = controller.findIndex(store, data.id);
                            controller.setFieldsForEdit(store, index, data.data);
                            id = data.id;
                        }
                        else if (data.action === 'remove') {
                            for (var i = 0, iLen = data.data.length; i < iLen; i++) {
                                var index = controller.findIndex(store, data.data[i]);
                                store[index] = null; // Don't upset the indexes
                            }
                        }
                        localStorage.setItem(controller.localStorageName, JSON.stringify(store));
                        successCallback({"id": id});
                    }
                });
            };

            controller.setFieldsForAdd = function (store, data) {
                var o = {"DT_RowId": 'row_' + store.length};
                _.each(this.colNames, function (c) {
                    o[c] = data[c];
                }, this);
            };

            controller.setFieldsForEdit = function (store, index, data) {
                _.each(this.colNames, function (c) {
                    store[index][c] = data[c];
                }, this);
            };

            controller.findIndex = function (store, id) {
                for (var i = 0, iLen = store.length; i < iLen; i++) {
                    if (store[i].DT_RowId === 'row_' + i) {
                        return i;
                    }
                }
                return -1;
            };

            controller.hideColumnsDialog = function () {
                DataTableUtils.hideColumnsDialog(this.colNames, this.hiddenCols, this.dataTable, this.editor)
            };

            controller.findReplaceDialog = function () {
                DataTableUtils.findReplaceDialog(this.colNames, this.hiddenCols, this.findReplaceVals, this.dataTable, this.editor, this.startNo - 1, this.endNo - 1)
            };

            controller.pushDownDialog = function () {
                DataTableUtils.pushDownDialog(this.colNames, this.hiddenCols, this.pushDownVals, this.dataTable, this.editor, this.startNo - 1, this.endNo - 1)
            };

            controller.getTableTools = function () {
                return {
                    "sRowSelect": "multi",
                    "aButtons": [
                        //{ "sExtends": "editor_create", "editor": controller.editor, "sButtonText": "Add Row" },
                        //{ "sExtends": "editor_edit", "editor": controller.editor, "sButtonText": "Edit Row"  },
                        //{ "sExtends": "editor_remove", "editor": controller.editor, "sButtonText": "Delete Row"  },
                        { "sExtends": "copy", "sButtonText": "Copy to clipboard", "sButtonClass": "btn-small"},
                        { "sExtends": "csv", "sButtonText": "Save to File", "sButtonClass": "btn-small"},
                        { "sExtends": "ourbutton", "sButtonText": '<i class="icon-repeat" title="Reload CSV from file">', "fnClick": function (nButton, oConfig) {
                            App.PageController.reloadGrid();
                        }},
                        /*
                         { "sExtends": "ourbutton", "sButtonText": '<i class="icon-remove-circle" title="Remove Columns">', "fnClick": function (nButton, oConfig) {
                         App.DataTableController.hideColumnsDialog();
                         }},
                         */
                        { "sExtends": "ourbutton", "sButtonText": '<i class="icon-replace" title="Find & Replace Values">', "fnClick": function (nButton, oConfig) {
                            App.DataTableController.findReplaceDialog();
                        }},
                        { "sExtends": "ourbutton", "sButtonText": '<i class="icon-circle-arrow-down" title="Push down values in a column">', "fnClick": function (nButton, oConfig) {
                            App.DataTableController.pushDownDialog();
                        }}/*,

                         { "sExtends": "editor_create", "editor": controller.editor },
                         { "sExtends": "editor_edit", "editor": controller.editor },
                         { "sExtends": "editor_remove", "editor": controller.editor }
                         */
                    ]
                };
            };

            controller.hideColumn = function (colIdx) {
                var colName = controller.colNames[colIdx];
                controller.hiddenCols.push(colName);
                controller.dataTable.fnSetColumnVis(colIdx, false);
            };

            controller.getDgColumnDefs = function (colNames) {
                var i = 0;
                var aoColumnDefs = [];
                _.each(colNames, function (s) {
                        var sType = this.getType(s);
                        var bSortable = s == "Action" ? false : false;
                        var bVisible = true;
                        var sClass = "center";  //s == "Line" ? "index" : "center";
                        var name = s; //s[0] == "$" ? s.substr(1) : s;
                        var sTitle = s;
                        var width = null;       // default to null, and it will be auto

                        if (s == "Action") {
                            width = "100px";
                        }
                        else if (s == "Status") {
                            width = "250px";
                        }
                        else if (s == "$SourcePath" || s == "$TargetPath" || s == "$ObjectName") {
                            width = "250px";
                        }
                        if (i > 1) {
                            sTitle += '<br><br><a href="javascript:App.DataTableController.hideColumn(' + i + ')"><i class="icon-remove-circle" title="Hide Column and exclude from load."></a>';
                        }
                        aoColumnDefs.push({ "mData": name, "sName": name, "aTargets": [i], "sTitle": sTitle, "sType": sType, "sClass": sClass, "bVisible": bVisible, "bSortable": bSortable, "sWidth": width});
                        i++;
                    }, this
                )
                ;
                return aoColumnDefs;
            };

            controller.getDgEditorFields = function (colNames) {
                var editorFields = [];
                _.each(colNames, function (s) {
                    // set the editor fields here
                    var type = "text";
                    var ipOpts = [];
                    var name = s; //s[0] == "$" ? s.substr(1) : s;
                    if (s == "Action" || s == "Line" || s == "Status") {
                        type = "hidden";
                    }
                    editorFields.push({label: s, name: name, type: type, ipOpts: ipOpts})
                }, this);

                return editorFields;
            };

            controller.receiveDataFromDesktop = function (colNames, data, addActionRow, callback) {
                /*
                 // add any extra lines here
                 if (addActionRow) {
                 //controller.addActionRow(colNames, data);
                 }
                 this.colNames = colNames;
                 // guess the action
                 App.PageController.fineTuneOptions(colNames);
                 this.processData(data, [], true);
                 this.dgEditorFields = this.getDgEditorFields(colNames);
                 this.dgColumnDefs = this.getDgColumnDefs(colNames);
                 this.setupEditor();
                 this.totalNumItems = data.length;
                 this.drawDataTableCsv(true, callback, data);
                 */
            };

            controller.doServerCsv = function (numItems, csvPath, colNames, callback, errorCallback) {
                var i = 0;
                this.totalNumItems = numItems;
                this.colNames = colNames;
                this.csvPath = csvPath;
                this.dataTableFunc = "syntbt.openCsv";
                this.dgColumnDefs = this.getDgColumnDefs(colNames);
                this.dgEditorFields = this.getDgEditorFields(colNames);
                this.setupEditor();
                this.drawDataTableCsv(true, callback, null, colNames, errorCallback);
            };

            controller.addActionRow = function (colNames, data) {
                var line1 = {};
                var j = 0;
                _.each(colNames, function (c) {
                    line1[c] = j < 3 ? '' : '<a href="javascript:App.DataTableController.removeColumn(\'' + c + '\',' + j + ')"><i class="icon-remove-circle" title="Remove the column"></i></a>&nbsp;&nbsp;<a href="javascript:App.DataTableController.findAndReplace(\'' + c + '\',' + j + ')"><i class="icon-search" title="Do a Find and Replace for all rows in column"></i></a>&nbsp;&nbsp;<a href="javascript:App.DataTableController.pushDownVal(\'' + c + '\',' + j + ')"><i class="icon-circle-arrow-down" title="Push down a value to all rows in column"></i></a>';
                    j++;
                }, this);
                data.splice(0, 0, line1);
            };

            controller.getType = function (colName) {
                switch (colName) {
                    case "Line":
                        return 'numeric';
                        break;
                    case "$ObjectType":
                        return 'numeric';
                        break;
                    case "Action": case "Status":
                        return 'html';
                        break;
                    default:
                        return 'string'
                }
            };

            controller.reset = function () {
                controller.hiddenCols = [];
                controller.pushDownVals = {};
                controller.findReplaceVals = {};
                controller.statusColVals = {};
                controller.startNo = 1;
                controller.endNo = 10;
            };

            controller.refreshColumns = function (data) {
                controller.drawDataTableCsv(false, null, data);
            };

            controller.redraw = function () {
                this.dataTable.fnDraw();
            };

            controller.getDom = function () {
                /* other possible formats
                 "sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                 "sDom": controller.useTableTools && controller.filter ? '<"H"Tfr>tS<"F">' : '<"H"r>tS<"F">',

                 "sDom": "THFfrtip<'clear'>",
                 */
                var s = '';
                if (controller.useTableTools) {
                    s += "Tp";
                }
                s += "HF";
                if (controller.filter) {
                    //s += "f";
                }
                s += "rtip<'clear'>";
                return s;
            };

            controller.getSourceSettings = function () {
                return {hiddenCols: this.hiddenCols, findReplaceVals: this.findReplaceVals, pushDownVals: this.pushDownVals, statusColVals: this.statusColVals};
            };

            controller.drawDataTableCsv = function (doClearFirst, callback, data, colNames, errorCallback) {
                if (doClearFirst) {
                    controller.clearDataTable();
                }
                controller.errorCallback = !errorCallback ? controller.errorCallback : errorCallback;
                var isServerSide = !data && controller.dataTableFunc;
                var table = controller.dataTable = $(controller.gridId).dataTable({
                        /*"aaSorting": [[ 1, "asc" ]],
                         "bDeferRender": true,
                         "bScrollCollapse": true,
                         */
                        "aaData": data ? data : null,
                        "bProcessing": true,
                        "bDestroy": true,
                        "bFilter": controller.filter,
                        "sScrollX": "100%",
                        //"sScrollY": "400px",
                        "iDisplayLength": 10,
                        "bPaginate": true,
                        "bSortable": false,
                        "sPaginationType": "full_numbers",
                        "bAutoWidth": true,
                        "sDom": controller.getDom(),
                        "aoColumnDefs": controller.dgColumnDefs,
                        "bServerSide": isServerSide,
                        "bJQueryUI": true,
                        "oTableTools": controller.useTableTools ? controller.getTableTools() : null,
                        "fnDrawCallback": function (oSettings) {
                            controller.startNo = oSettings._iDisplayStart + 1;
                            controller.endNo = Math.min(oSettings._iRecordsTotal, oSettings._iDisplayStart + oSettings._iDisplayLength);
                        },
                        "fnServerData": isServerSide ? function (sSource, aoData, fnCallback, oSettings) {
                            var start = oSettings._iDisplayStart;
                            var len = oSettings._iDisplayLength;
                            var total = controller.totalNumItems;
                            oSettings.jqXHR = App.ServerAPI.getCsvTableJqXHR(controller.dataTableFunc, colNames, controller.csvPath, fnCallback, errorCallback, controller.processData, start, len, controller.totalNumItems, App.ProcessController.getNodes(start + 1, start + len), controller.getSourceSettings())
                        } : null
                    }
                );

                new FixedColumns(table);

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

                // Delete a record (asking a user for confirmation)
                $(this.gridId).on('click', 'a.editor_remove', function (e) {
                    e.preventDefault();
                    var row = $(this).parents('tr')[0];
                    controller.editor.message("Are you sure you want to remove this row?");
                    controller.editor.remove(row, 'Delete row', {
                        "label": "Confirm",
                        "fn": function () {
                            this.submit();
                        }
                    });
                });

                if (callback) {
                    callback();
                }

            };

            controller.setEmptyStringOnColumn = function (colIdx) {
                DataTableUtils.setEmptyStringOnColumn(colIdx, controller.dataTable, this.startNo - 1, this.endNo - 1);
            };

            controller.showSuccessNode = function (id, path, text) {
                var html = '<span style="color: green; font-weight: bold">' + text + '</span>';
                this.statusColVals[id] = html;
                if (id >= controller.startNo && id <= controller.endNo) {
                    this.dataTable.fnUpdate(html, id - 1, 1, false, false);
                }
            };

            controller.showSkippedNode = function (id, path, text) {
                this.statusColVals[id] = text;
                if (id >= controller.startNo && id <= controller.endNo) {
                    this.dataTable.fnUpdate(text, id - 1, 1, false, false);
                }
            };

            controller.showErrorNode = function (id, path, errMsg) {
                var html = '<span style="color: red; font-weight: bold" title="' + errMsg + '">Error</span>';
                this.statusColVals[id] = html;
                if (id >= controller.startNo && id <= controller.endNo) {
                    this.dataTable.fnUpdate(html, id - 1, 1, false, false);
                }
            };

            controller.clearResults = function (errorNodes) {
                controller.setEmptyStringOnColumn(1);
                controller.statusColVals = {};
            };

            return controller;
        }

    }
)
;


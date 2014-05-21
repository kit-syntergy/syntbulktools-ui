define(["jquery", "lodash", "text!templates/tableDialog.html", "async"],
    function ($, _, tableDialogHtml, async) {
        /*global App */

        var privObj = {
            setDataColumn: function (colIdx, data, dataTable, startNo, endNo) {
                for (var i = startNo; i <= endNo; i++) {
                    dataTable.fnUpdate(data, i, colIdx, false, false);
                }
                App.ProcessController.setInvalidForLoad();
            },

            findReplaceDataCol: function (colIdx, findVal, replaceVal, dataTable, startNo, endNo) {
                for (var i = startNo; i <= endNo; i++) {
                    var val = dataTable.fnGetData(i, colIdx) || '';
                    val = val.replace(findVal, replaceVal);
                    dataTable.fnUpdate(val, i, colIdx, false, false);
                }
                App.ProcessController.setInvalidForLoad();
            },

            hideColumn: function (colNames, colName, colIdx, dataTable) {
                dataTable.fnSetColumnVis(colIdx, false);
                App.ProcessController.setInvalidForLoad();
            }
        };

        return {
            getColNameSelectOpts: function (colNames, hiddenCols) {
                /* needs to be in this format
                 { "label": "1 (highest)", "value": "1" }
                 { "label": "2",           "value": "2" }
                 */
                var i = 0;
                var opts = [];
                _.each(colNames, function (c) {
                    if (i > 1 && !_.contains(hiddenCols, c)) {
                        opts.push({ "label": c, "value": i});
                    }
                    i++;
                }, this);

                return opts;

            },
            hideColumnsDialog: function (colNames, hiddenCols, dataTable, editor) {
                var colNameOpts = this.getColNameSelectOpts(colNames, hiddenCols);
                $("#pushDownTableDiv").remove();
                var pageContext = {};
                var template = Handlebars.compile(tableDialogHtml);
                var html = template(pageContext);
                $("body").append(html);
                var editor = new $.fn.dataTable.Editor({
                    "domTable": '#pushDownTable',
                    "fields": [
                        {
                            "label": "Column",
                            "name": "colIdx",
                            "type": "select",
                            "ipOpts": colNameOpts
                        }
                    ],
                    "ajax": function (method, url, data, successCallback, errorCallback) {
                        var id = null;
                        var colIdx = data.data.colIdx;
                        var colName = colNames[colIdx];
                        if (data.action === 'edit') {
                            editor.close();
                            hiddenCols.push(colName);
                            privObj.hideColumn(colNames, colName, colIdx, dataTable);
                        }
                    }
                });
                editor.edit(
                    $("#pushDownRow")[0],
                    "Remove Columns",
                    { "label": "Submit", "fn": function () {
                        editor.submit()
                    }}
                );

            },
            findReplaceDialog: function (colNames, hiddenCols, findReplaceVals, dataTable, editor, startNo, endNo) {
                var colNameOpts = this.getColNameSelectOpts(colNames, hiddenCols);
                $("#pushDownTableDiv").remove();
                var pageContext = {};
                var template = Handlebars.compile(tableDialogHtml);
                var html = template(pageContext);
                $("body").append(html);
                var editor = new $.fn.dataTable.Editor({
                    "domTable": '#pushDownTable',
                    "fields": [
                        {
                            "label": "Column",
                            "name": "colIdx",
                            "type": "select",
                            "ipOpts": colNameOpts },
                        {
                            "label": "Find",
                            "name": "findVal" },
                        {
                            "label": "Replace",
                            "name": "replaceVal" }

                    ],
                    "ajax": function (method, url, data, successCallback, errorCallback) {
                        var id = null;
                        var colIdx = data.data.colIdx;
                        var colName = colNames[colIdx];
                        var findVal = data.data.findVal;
                        var replaceVal = data.data.replaceVal;
                        if (data.action === 'edit') {
                            editor.close();
                            App.PageController.confirm("Replace the string \"" + findVal + "\" with \"" + replaceVal + "\" for all rows in the " + colName + " column? (Note: you can reload the file to undo changes)",
                                function (result) {
                                    if (result) {
                                        findReplaceVals[colName] = {"find": findVal, "replace": replaceVal};
                                        privObj.findReplaceDataCol(colIdx, findVal, replaceVal, dataTable, startNo, endNo)
                                    }
                                })
                        }
                    }
                });
                editor.edit(
                    $("#pushDownRow")[0],
                    "Find and Replace values in a column for all rows",
                    { "label": "Submit", "fn": function () {
                        editor.submit()
                    }}
                );
            },
            pushDownDialog: function (colNames, hiddenCols, pushDownVals, dataTable, editor, startNo, endNo) {
                var colNameOpts = this.getColNameSelectOpts(colNames, hiddenCols);
                $("#pushDownTableDiv").remove();
                var pageContext = {};
                var template = Handlebars.compile(tableDialogHtml);
                var html = template(pageContext);
                $("body").append(html);
                var editor = new $.fn.dataTable.Editor({
                    "domTable": '#pushDownTable',
                    "fields": [
                        {
                            "label": "Column",
                            "name": "colIdx",
                            "type": "select",
                            "ipOpts": colNameOpts },
                        {
                            "label": "Value",
                            "name": "value" }

                    ],
                    "ajax": function (method, url, data, successCallback, errorCallback) {
                        var val = data.data.value;
                        var colIdx = data.data.colIdx;
                        var colName = colNames[colIdx];
                        if (data.action === 'edit') {
                            editor.close();
                            App.PageController.confirm("Set the value of " + colName + " to \"" + val + "\" for all rows? (Note: you can reload the file to undo changes)",
                                function (result) {
                                    if (result) {
                                        pushDownVals[colName] = val;
                                        privObj.setDataColumn(colIdx, val, dataTable, startNo, endNo)
                                    }
                                })
                        }
                    }
                });
                editor.edit(
                    $("#pushDownRow")[0],
                    "Push Down a Value to all rows in a column",
                    { "label": "Submit", "fn": function () {
                        editor.submit()
                    }}
                );
            },
            setEmptyStringOnColumn: function (colIdx, dataTable, startNo, endNo) {
                privObj.setDataColumn(colIdx, '', dataTable, startNo, endNo);
            }
        }
    });

define(["jquery", "lodash", "datatables", "datatablesEditor", "tabletools", "zeroclipboard", "async"],
    function ($, _, dataTables, dataTablesEditor, tabletools, zeroclipboard, async) {
        /*global App */
        /*global LL_URL*/
        return {
            gridId: "#grid",
            editor: null,
            colNames: [],
            dgColumnDefs: [],
            dgEditorFields: [],
            dataTable: null,
            useTableTools: true,
            noFilter: false,
            columnHighlighting: false,
            clearDataTable: function () {
                if (this.dataTable) {
                    this.dataTable.fnDestroy();
                    $(this.gridId).html('');
                    $(this.gridId).removeClass("dataTable DTTT_selectable");
                    this.dataTable = null;
                }
            },
            initController: function (model) {
                // implement in subclasses
            },
            setupEditor: function () {
                // implement in subclasses
            }
        }

    });



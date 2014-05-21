define({
    app_name: "App",
    //urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "app": "app",
        "config": "config",
        "router": "router",
        "LoadValidateController": "bulkloader/controllers/LoadValidateController",
        "BulkLoaderPageController": "bulkloader/controllers/page_controllers/BulkLoaderPageController",
        "CsvPageController": "bulkloader/controllers/page_controllers/CsvPageController",
        "LoadFromCsvPage": "bulkloader/controllers/page_controllers/LoadFromCsvPage",
        "LoadUsersPage": "bulkloader/controllers/page_controllers/LoadUsersPage",
        "LoadFromFolderStructurePage": "bulkloader/controllers/page_controllers/LoadFromFolderStructurePage",
        "ManageLoadPathsPage": "bulkloader/controllers/page_controllers/ManageLoadPathsPage",
        "ManageLoadJobsPage": "bulkloader/controllers/page_controllers/ManageLoadJobsPage",
        "ManageLoadPrivilegesPage": "bulkloader/controllers/page_controllers/ManageLoadPrivilegesPage",
        "ManageLoadProfilesPage" : "bulkloader/controllers/page_controllers/ManageLoadProfilesPage",
        "BL_SettingsPage": "bulkloader/controllers/page_controllers/SettingsPage",
        "LoadPathModel": "bulkloader/models/loadpath",
        "LoadJobModel": "bulkloader/models/loadjob",
        "LoadPrivilegeModel": "bulkloader/models/loadprivilege",
        "LoadProfileModel": "bulkloader/models/loadprofile",
        "ExportController": "bulkexporter/controllers/ExportController",
        "BulkExporterPageController": "bulkexporter/controllers/page_controllers/BulkExporterPageController",
        "ExportUsersGroupsPage": "bulkexporter/controllers/page_controllers/ExportUsersGroupsPage",
        "ExportMetadataPage": "bulkexporter/controllers/page_controllers/ExportMetadataPage",
        "ExportObjectsPage": "bulkexporter/controllers/page_controllers/ExportObjectsPage",
        "ManageExportPathsPage": "bulkexporter/controllers/page_controllers/ManageExportPathsPage",
        "ManageExportJobsPage": "bulkexporter/controllers/page_controllers/ManageExportJobsPage",
        "ManageExportPrivilegesPage": "bulkexporter/controllers/page_controllers/ManageExportPrivilegesPage",
        "ManageExportProfilesPage" : "bulkexporter/controllers/page_controllers/ManageExportProfilesPage",
        "BE_SettingsPage": "bulkexporter/controllers/page_controllers/SettingsPage",
        "ExportPathModel": "bulkexporter/models/exportpath",
        "ExportJobModel": "bulkexporter/models/exportjob",
        "ExportPrivilegeModel": "bulkexporter/models/exportprivilege",
        "ExportProfileModel": "bulkexporter/models/exportprofile",
        "ErrorController": "controllers/ErrorController",
        "FileController": "controllers/FileController",
        "ProcessController": "controllers/ProcessController",
        "RootPageController": "controllers/page/RootPageController",
        "FaqPage": "controllers/page/FaqPage",
        "HelpPage": "controllers/page/HelpPage",
        "AbstractDataTableController": "controllers/datatable/AbstractDataTableController",
        "DataTableCrudController": "controllers/datatable/DataTableCrudController",
        "DataTableCsvController": "controllers/datatable/DataTableCsvController",
        "ContentServerAPI": "utils/ContentServerAPI",
        "TreeController": "controllers/TreeController",
        "JobScheduleController" : "controllers/page/JobScheduleController",
        "ProfileController" : "controllers/page/ProfileController",
        "popup": "utils/popup",
        "ProgressBar" : "utils/ProgressBar",
        "customfile": "utils/customfile",
        "CsvParser": "utils/CsvParser",
        "OScriptParser": "utils/OScriptParser",
        "StopWatch" : "utils/StopWatch",
        "combobox"  : "utils/combobox",
        "DataTableUtils" : "utils/DataTableUtils",
        /*../libs*/
        'jquery': '../libs/jquery/1.9.1/jquery.min',
        'jquery-cookie': '../libs/jquery/1.9.1/jquery.cookie',
        'dynatree': '../libs/dynatree/1.2.4/jquery.dynatree.min',
        'contextMenu': '../libs/contextmenu/1.2.2/jquery.ui-contextmenu.min',
        'async': '../libs/async/0.2.9/async',
        'routie': '../libs/routie/0.3.2/routie',
        'handlebars': '../libs/handlebars/1.0.rc.4/handlebars',
        'jquery-ui': '../libs/jquery-ui/1.10.3/jquery-ui.custom.min',
        'bootstrap': '../libs/bootstrap/2.2.2/bootstrap.min',
        'bootbox': '../libs/bootbox/4.0.0/bootbox.min',
        'lodash': '../libs/lodash/2.4.1/lodash.compat',
        'liteAccordion': '../libs/liteaccordion/1.3/liteaccordion.jquery.min',
        // datatables
        'datatables': '../libs/datatables/1.9.4/jquery.dataTables',
        'jeditable': '../libs/jeditable/1.7.1/jquery.jeditable',
        'datatablesEditor': '../libs/datatables-editor/dataTables.editor.min',
        'scroller': '../libs/scroller/1.2.0/dataTables.scroller.min',
        'fixedColumns': '../libs/fixedcolumns/1.10.0/dataTables.fixedColumns',
        'tabletools': '../libs/tabletools/2.1.5/TableTools.min',
        'zeroclipboard': '../libs/tabletools/2.1.5/ZeroClipboard',
        /*requirejs-plugins*/
        'text': '../libs/requirejs-plugins/text',
        'hbs': '../libs/requirejs-plugins/hbs',
        'domReady': '../libs/requirejs-plugins/domReady'
    },
    /*hbs plugin options*/
    hbs: {
        disableI18n: true,
        templateExtension: "html"
    },
    shim: {
        'app': {
            exports: 'App'
        },
        'async': {
            exports: 'async'
        },
        'bootbox': {
            deps: ['jquery', 'bootstrap'],
            exports: 'bootbox'
        },
        'dynatree': {
            deps: ['jquery', 'jquery-ui'],
            exports: 'DynaTree'
        },
        'contextMenu': {
            deps: ['jquery', 'jquery-ui']
        },
        'jquery-cookie': {
            deps: ['jquery']
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'jeditable': {
            deps: ['jquery'],
            exports: 'JEditable'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'datatables': {
            deps: ['jquery'],
            exports: 'DataTable'
        },
        routie: {
            exports: 'routie'
        },
        'combobox': {
            deps: ['jquery-ui']
        },
        customfile: {
            deps: ['jquery']
        },
        CsvParser: {
            deps: ['jquery'],
            exports: 'CsvParser'
        },
        StopWatch: {
            exports: 'StopWatch'
        },
        filereader: {
            deps: ['jquery'],
            exports: 'MyFileReader'
        },
        tabletools: {
            deps: ['jquery', 'datatables'],
            exports: 'TableTools'
        },
        scroller: {
            deps: ['jquery', 'datatables'],
            exports: 'scroller'
        },
        fixedHeader: {
            deps: ['jquery', 'datatables'],
            exports: 'fixedHeader'
        },
        fixedColumns: {
            deps: ['jquery', 'datatables'],
            exports: 'fixedColumns'
        },
        datatablesEditor: {
            deps: ['datatables', 'tabletools'],
            exports: 'Editor'
        },
        zeroclipboard: {
            deps: ['jquery', 'tabletools'],
            exports: 'ZeroClipboard_TableTools'
        },
        liteAccordion: {
            deps: ['jquery'],
            exports: 'liteAccordion'
        }
    }
});
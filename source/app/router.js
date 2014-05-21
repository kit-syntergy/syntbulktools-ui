define(["jquery",
    "handlebars",
    "DataTableCsvController",
    "DataTableCrudController",
    "ErrorController",
    "FileController",
    "FaqPage",
    "HelpPage",
    "ManageLoadPathsPage",
    "ManageLoadJobsPage",
    "ManageLoadPrivilegesPage",
    "LoadFromFolderStructurePage",
    "LoadFromCsvPage",
    "LoadUsersPage",
    "BL_SettingsPage",
    "LoadValidateController",
    "ManageExportPathsPage",
    "ManageExportJobsPage",
    "ManageExportPrivilegesPage",
    "ExportObjectsPage",
    "ExportMetadataPage",
    "ExportUsersGroupsPage",
    "BE_SettingsPage",
    "ExportController",
    "TreeController",
    "ManageLoadProfilesPage",
    "ManageExportProfilesPage",
    "ProfileController",
    "JobScheduleController"
],
    function ($, Handlebars, DataTableCsvController, DataTableCrudController, ErrorController, FileController, FaqPage, HelpPage, BL_ManageLoadPathsPage, BL_ManageLoadJobsPage, BL_ManagePrivilegesPage, BL_LoadFromFolderStructurePage, BL_LoadFromCsvPage, BL_LoadUsersPage, BL_SettingsPage, BL_LoadValidateController, BE_ManageExportPathsPage, BE_ManageExportJobsPage, BE_ManagePrivilegesPage, BE_ExportObjectsPage, BE_ExportMetadataPage, BE_ExportUsersPage, BE_SettingsPage, BE_ExportController, TreeController, BL_ManageLoadProfilesPage, BE_ManageExportProfilesPage, ProfileController, JobScheduleController) {
        return {
            /*global App */
            switchPage: function (moduleName, pageName, formVals, updateAddress, triggerChanges) {

                // *** on switch page, make sure we clear out any real time updating from jobs page
                _.each(App.intervalIds, function (intervalId) {
                    window.clearInterval(intervalId);
                    App.log("cleared intervalId " + intervalId)
                });
                App.intervalIds = [];

                require([moduleName + "/fixtures/" + pageName],
                    function (pageContext) {
                        // inactivate the active link
                        $('.active').toggleClass('active');
                        $('#' + moduleName + "-" + pageName).toggleClass('active');

                        // empty out the outlet
                        $('#outletDiv').html('');

                        var baseTemplate;
                        var pageTemplate1 = "blank";
                        var pageTemplate2 = "blank";
                        var pageTemplate3 = "blank";
                        var pageTemplate4 = "blank";

                         // default all the controllers to null
                        App.SourceViewController = null;
                        App.DataTableController = null;
                        App.PageController =  null;
                        App.SourcePathSelectController =  null;
                        App.TargetPathSelectController = null;
                        App.TargetViewController =  null;
                        App.ProcessController =  null;
                        App.ProfileController = null;
                        App.JobScheduleController = null;
                        App.ProcessController = null;

                        // set our controller
                        switch (moduleName) {

                            case 'bulkloader':
                                switch (pageName) {
                                    case 'loadfolderstructure':
                                        baseTemplate = 'form_with_source_target_trees';
                                        pageTemplate1 = pageName;
                                        pageTemplate2 = 'name_collisions';
                                        pageTemplate3 = 'load_advanced';
                                        pageTemplate4 = 'schedule_job';
                                        App.DataTableController = new DataTableCsvController({noTableTools: true});
                                        App.PageController = new BL_LoadFromFolderStructurePage();
                                        App.SourceViewController = App.SourceTreeController = new TreeController("sourceDiv");
                                        App.TargetViewController = new TreeController("targetDiv");
                                        App.ProcessController = new BL_LoadValidateController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'loadcsv':
                                        baseTemplate = 'form_with_grid';
                                        pageTemplate1 = pageName;
                                        pageTemplate2 = 'name_collisions';
                                        pageTemplate3 = 'load_advanced';
                                        pageTemplate4 = 'schedule_job';
                                        App.SourceViewController = App.DataTableController = new DataTableCsvController({columnHighlighting: true});
                                        App.PageController = new BL_LoadFromCsvPage();
                                        App.ProcessController = new BL_LoadValidateController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'loadusers':
                                        baseTemplate = 'form_with_grid';
                                        pageTemplate1 = pageName;
                                        pageTemplate2 = 'user_name_collisions';
                                        pageTemplate4 = 'schedule_job';
                                        App.SourceViewController = App.DataTableController = new DataTableCsvController({columnHighlighting: true});
                                        App.PageController = new BL_LoadUsersPage();
                                        App.ProcessController = new BL_LoadValidateController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'manageloadpaths':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BL_ManageLoadPathsPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageloadjobs':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BL_ManageLoadJobsPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageprofiles':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BL_ManageLoadProfilesPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageprivileges':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BL_ManagePrivilegesPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'settings':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'form_only';
                                        App.PageController = new BL_SettingsPage();
                                        break;

                                    case 'faq':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'simple_text_page';
                                        App.PageController = new FaqPage();
                                        break;

                                    case 'help':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'simple_text_page';
                                        App.PageController = new HelpPage();
                                        break;
                                }

                                break;

                            case 'bulkexporter':
                                switch (pageName) {
                                    case 'exportobjects':
                                        baseTemplate = 'form_with_source_target_trees';
                                        pageTemplate1 = pageName;
                                        pageTemplate2 = "export_options";
                                        //pageTemplate3 = 'export_advanced';  don't show this for now -- no advanced options
                                        pageTemplate4 = 'schedule_job';
                                        App.DataTableController = new DataTableCsvController({noTableTools: true});
                                        App.PageController = new BE_ExportObjectsPage();
                                        App.SourceViewController = App.SourceTreeController = new TreeController("sourceDiv");
                                        App.TargetViewController = new TreeController("targetDiv");
                                        App.ProcessController = new BE_ExportController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'exportmetadata':
                                        baseTemplate = 'form_with_source_target_trees';
                                        pageTemplate1 = pageName;
                                        pageTemplate2 = "export_options";
                                        //pageTemplate3 = 'export_advanced';  //currently don't need this because there are no adv options shown
                                        pageTemplate4 = 'schedule_job';
                                        App.PageController = new BE_ExportMetadataPage();
                                        App.SourceViewController = App.SourceTreeController = new TreeController("sourceDiv");
                                        App.TargetViewController = new TreeController("targetDiv");
                                        App.ProcessController = new BE_ExportController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'exportusers':
                                        baseTemplate = 'form_with_source_target_trees';
                                        pageTemplate1 = pageName;
                                        pageTemplate4 = 'schedule_job';
                                        App.PageController = new BE_ExportUsersPage();
                                        App.SourceViewController = App.SourceTreeController = new TreeController("sourceDiv");
                                        App.TargetViewController = new TreeController("targetDiv");
                                        App.ProcessController = new BE_ExportController();
                                        App.ProfileController = ProfileController;
                                        App.JobScheduleController = new JobScheduleController();
                                        break;

                                    case 'manageexportpaths':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BE_ManageExportPathsPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageexportjobs':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BE_ManageExportJobsPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageprofiles':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BE_ManageExportProfilesPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'manageprivileges':
                                        baseTemplate = 'grid_only';
                                        App.PageController = new BE_ManagePrivilegesPage();
                                        App.DataTableController = new DataTableCrudController();
                                        break;

                                    case 'settings':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'form_only';
                                        App.PageController = new BE_SettingsPage();
                                        break;

                                    case 'faq':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'simple_text_page';
                                        App.PageController = new FaqPage();
                                        break;

                                    case 'help':
                                        pageTemplate1 = pageName;
                                        baseTemplate = 'simple_text_page';
                                        App.PageController = new HelpPage();
                                        break;
                                }

                                break;
                        }

                        // now put the template in there
                        require(["text!" + "templates/" + baseTemplate + ".html",
                            "text!" + "templates/form_advanced.html",
                            "text!" + moduleName + "/templates/" + pageTemplate1 + ".html",
                            "text!" + moduleName + "/templates/" + pageTemplate2 + ".html",
                            "text!" + moduleName + "/templates/" + pageTemplate3 + ".html",
                            "text!" + "templates/" + pageTemplate4 + ".html"],
                            function (baseTemplate, formTemplate, pageTemplate1, pageTemplate2, pageTemplate3, pageTemplate4) {
                                baseTemplate = Handlebars.compile(baseTemplate);
                                formTemplate = Handlebars.compile(formTemplate);
                                pageTemplate1 = Handlebars.compile(pageTemplate1);
                                pageTemplate2 = Handlebars.compile(pageTemplate2);
                                pageTemplate3 = Handlebars.compile(pageTemplate3);
                                pageTemplate4 = Handlebars.compile(pageTemplate4);

                                Handlebars.registerPartial("form_template", formTemplate);
                                Handlebars.registerPartial("page_content1", pageTemplate1);
                                Handlebars.registerPartial("page_content2", pageTemplate2);
                                Handlebars.registerPartial("page_content3", pageTemplate3);
                                Handlebars.registerPartial("page_content4", pageTemplate4);

                                var html = baseTemplate(pageContext);
                                $('#outletDiv').append(html);

                                // finally initiate the page
                                App.PageController.initPage(formVals, triggerChanges);

                                if (App.ProfileController){
                                    // intialize the profile Controller as it has some event listeners
                                    App.ProfileController.initPage();
                                }

                                if (App.JobScheduleController){
                                    App.JobScheduleController.initPage();
                                }

                                if (updateAddress){
                                    var html = $('html').html();
                                    var pageTitle = document.title;
                                    var location = window.location;
                                    var url = location.href.replace(location.hash, "#" + moduleName + "/" + pageName);
                                    window.history.pushState({"html":html,"pageTitle":pageTitle},"", url);
                                }

                            });
                    });
            }
        };

    });
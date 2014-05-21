define({colNames: ["id"
    , "action"
    , "name"
    , "rootSourcePath"
    , "rootExportPath"
    , "exportType"
    , "enabled"
    , "exporttype"
    , "jobSubtype"
    , "numMetadataFiles"
    , "numSubLevels"
    , "wantFilesOnly"
    , "wantCategoryData"
    , "wantClassifications"
    , "wantPerms"
    , "wantPhysObj"
    , "wantProjects"
    , "wantEmails"
    , "wantAllVersions"
    , "useObjectIdForFolderName"
    , "useObjectIdForFileName"
    , "documentFilterDate"
    , "maxNameLength"],

    "dgColumnDefs": [
        {"mData": "Action", "sName": "Action", "aTargets": [0], "sTitle": "Action", "sClass": "center", "sType": "html", "sWidth": "15%", "sDefaultContent": '&nbsp;<a href="" class="editor_editprofile">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
        {"mData": "profileId", "sName": "profileId", "aTargets": [1], "sTitle": "Name", "sClass": "center", "sType": "string", "sWidth": "20%" },
        {"mData": "jobSubtype", "sName": "jobSubtype", "aTargets": [2], "sTitle": "Export Type", "sClass": "center", "sType": "string", "sWidth": "15%" },
        {"mData": "exportType", "sName": "exportType", "aTargets": [3], "sTitle": "Flat or Hierarchy", "sClass": "center", "sType": "string", "sWidth": "15%" },
        {"mData": "rootSourcePath", "sName": "rootSourcePath", "aTargets": [4], "sTitle": "Source Path", "sClass": "center", "sType": "string", "sWidth": "15%" },
        {"mData": "rootExportPath", "sName": "rootExportPath", "aTargets": [5], "sTitle": "Target Path", "sClass": "center", "sType": "string", "sWidth": "15%" }
    ]
});


/*define({
 dgEditorFields: [
 {"type": "hidden", "name": "id"},
 {"type": "text", "label": "Name", "name": "name"},
 {"type": "text", "label": "Source Path", "name": "rootSourcePath" },
 {"type": "text", "label": "Root Export Path", "name": "rootExportPath" },
 {"type": "checkbox", "label": "Enabled", "name": "enabled",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "radio", "label": "Structure", "name": "exporttype",
 "ipOpts": [
 { "label": "exportobjects", "value": "exportobjects" },
 { "label": "exportmetadata", "value": "exportmetadata" }
 ]
 },
 {"type": "radio", "label": "Hierarchy or Flat", "name": "exportType",
 "ipOpts": [
 { "label": "hierarchy", "value": "hierarchy" },
 { "label": "flat", "value": "flat" }
 ]
 },
 {"type": "radio", "label": "Number of Metadata Files", "name": "numMetadataFiles",
 "ipOpts": [
 { "label": "multiple", "value": "multiple" },
 { "label": "single", "value": "single" }
 ]
 },
 {"type": "radio", "label": "Number of Sub Levels", "name": "numSubLevels",
 "ipOpts": [
 { "label": "All", "value": "All" },
 { "label": "1", "value": "1" }
 ]
 },
 {"type": "date", "label": "Limit Documents to those Created since", "name": "documentFilterDate"},
 {"type": "text", "label": "Maximum Length for Object Names", "name": "maxNameLength"},
 {"type": "checkbox", "label": "Export Files Only", "name": "wantFilesOnly",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Category Date", "name": "wantCategoryData",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Classifications", "name": "wantClassifications",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Permissions", "name": "wantPerms",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Physical Objects", "name": "wantPhysObj",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Projects", "name": "wantProjects",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export Emails", "name": "wantEmails",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Export All Versions", "name": "wantAllVersions",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Name exported folders with unique dataid", "name": "useObjectIdForFolderName",
 "ipOpts": [
 { "label": "", "value": "true" }
 ]
 },
 {"type": "checkbox", "label": "Name exported files with unique dataid", "name": "useObjectIdForFileName",
 "ipOpts": [
 { "label": "", "value": "true"}
 ]
 }
 ],
 "dgColumnDefs": [
 {"mData": "id", "sName": "id", "aTargets": [0], "sType": "string", "bVisible": false },
 {"mData": "action", "sName": "action", "aTargets": [1], "sTitle": "Action", "sClass": "center", "sType": "html", "sWidth": "10%", "sDefaultContent": '&nbsp;<a href="" class="editor_edit">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
 {"mData": "name", "sName": "name", "aTargets": [2], "sTitle": "Name", "sClass": "center", "sType": "string", "sWidth": "10%" },
 {"mData": "rootSourcePath", "sName": "rootSourcePath", "sTitle": "Source Path", "aTargets": [3], "sType": "string", sWidth: "15%" },
 {"mData": "rootExportPath", "sName": "rootExportPath", "sTitle": "Root Export Path", "aTargets": [4], "sType": "string", sWidth: "15%" },
 {"mData": "exportType", "sName": "exportType", "aTargets": [5], "sTitle": "Export Type", "sClass": "center", "sType": "string", "sWidth": "15%" },
 {"mData": "enabled", "sName": "enabled", "aTargets": [6], "sTitle": "Enabled", "sClass": "center", "sType": "string", "sWidth": "5%" },
 // everything below here is not visible in the grid, but it will be editable in the editor
 {"mData": "exporttype", "sName": "exporttype", "aTargets": [7], "sType": "string", "bVisible": false },
 //*value="exportobjects, exportmetadata"
 {"mData": "hierarchyRadio", "sName": "exportType", "aTargets": [8], "sType": "string", "bVisible": false },
 //*value="hierarchy,flat"
 {"mData": "multipleCSVRadio", "sName": "numMetadataFiles", "aTargets": [9], "sType": "string", "bVisible": false },
 //value="multiple,single"
 {"mData": "allSubLevelsRadio", "sName": "numSubLevels", "aTargets": [10], "sType": "string", "bVisible": false },
 // value="All,1"
 //value="now,async"
 {"mData": "wantFilesOnly", "sName": "wantFilesOnly", "aTargets": [11], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantCategoryData", "sName": "wantCategoryData", "aTargets": [12], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantClassifications", "sName": "wantClassifications", "aTargets": [13], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantPerms", "sName": "wantPerms", "aTargets": [14], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantPhysObj", "sName": "wantPhysObj", "aTargets": [15], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantProjects", "sName": "wantProjects", "aTargets": [16], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantEmails", "sName": "wantEmails", "aTargets": [17], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "wantAllVersions", "sName": "wantAllVersions", "aTargets": [18], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "useObjectIdForFolderName", "sName": "useObjectIdForFolderName", "aTargets": [19], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "useObjectIdForFolderName", "sName": "useObjectIdForFileName", "aTargets": [20], "sType": "string", "bVisible": false },
 //value="true"
 {"mData": "documentFilterDate", "sName": "documentFilterDate", "aTargets": [21], "sType": "string", "bVisible": false },
 // value date
 {"mData": "maxNameLength", "sName": "maxNameLength", "aTargets": [22], "sType": "string", "bVisible": false }
 //value="9999"
 ]});
 */



/* button inline edit and delete */
//'<button class="btn btn-mini editor_remove" style="margin-right: 10px;" type="button" id="EditButton">Delete</button><button class="btn btn-mini editor_edit" type="button" id="EditButton">Edit</button>'},

/* available field types for column defs:
 string, numeric, date and html
 */

/* available field types for editor fields:

 checkbox :field Show details
 List of checkbox input controls (<input type="checkbox">).

 date :field Show details
 Date input controls (uses jQuery UI's Datepicker, thus jQuery UI is a dependency if using this input).

 hidden :field Show details
 A hidden input that cannot be seen, nor modified by the end user (note that this does not use <input type="hidden"> - if you wish to set the value of this field use the set API method).

 password :field Show details
 Text input using an <input type="password"> control.

 radio :field Show details
 List of radio input controls (<input type="radio">).

 readonly :field Show details
 A read only text field that cannot be modified by the end user - this field will accept an HTML string if you wish to format the text (note to set the value of this field, other than the default, use the set API method).

 select :field Show details
 Select menu input using an <select> control (size=1).

 text :field Show details
 Text input using an <input type="text"> control.

 textarea :field Show details
 Text input using a <textarea> control.



 */
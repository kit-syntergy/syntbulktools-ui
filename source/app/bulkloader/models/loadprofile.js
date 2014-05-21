define({
    colNames: ["action",
        "asyncOption",
        "autoCreateCD",
        "autoCreateFolders",
        "containerAppendNum",
        "containerReportErrors",
        "containerUpdateMetadataOption",
        "defaultFileExtension",
        "errorFolderPath",
        "desktopSource",
        "docAddVersionIfNewerOption",
        "docAddVersionOption",
        "docAppendNum",
        "docReportErrors",
        "inheritParent",
        "jobSubtype",
        "jobType",
        "profileId",
        "requireMetadata",
        "rootFileLoc",
        "rootSourcePath",
        "rootTargetPath",
        "sourceOption",
        "serverSource",
        "sourcePathType",
        "targetPathType",
        "useFileModifyDate"],

    "dgColumnDefs": [
        {"mData": "Action", "sName": "Action", "aTargets": [0], "sTitle": "Row Actions", "sClass": "center", "sType": "html", "sWidth": "15%", "sDefaultContent": '&nbsp;<a href="" class="editor_editprofile">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
        {"mData": "profileId", "sName": "profileId", "aTargets": [1], "sTitle": "Name", "sClass": "center", "sType": "string", "sWidth": "10%" },
        {"mData": "jobSubtype", "sName": "jobSubtype", "aTargets": [2], "sTitle": "Load Type", "sClass": "center", "sType": "string", "sWidth": "10%" },
        {"mData": "action", "sName": "action", "aTargets": [3], "sTitle": "Action", "sClass": "center", "sType": "string", "sWidth": "10%" },
        {"mData": "rootSourcePath", "sName": "rootSourcePath", "aTargets": [4], "sTitle": "Source Path", "sClass": "center", "sType": "string", "sWidth": "15%" },
        {"mData": "rootTargetPath", "sName": "rootTargetPath", "aTargets": [5], "sTitle": "Target Path", "sClass": "center", "sType": "string", "sWidth": "15%" }
    ]
});



define({
    dgEditorFields: [
        {"type": "text", "label": 'User <span class="help-block" style="font-size: 9px">Auto-complete field: Type a few characters of a username, first name, or last name to search</span>', "name": "userName"},
        {"type": "checkbox", "label": 'Can Run Load Jobs<span class="help-block" style="font-size: 9px">Allows basic Load privileges (subject to a max number of items).</span>', "name": "canrunsync",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Load Users<span class="help-block" style="font-size: 9px">Allows user to Create/Update Users and Groups (must have User/Group Management Privileges).</span>', "name": "candousers",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Schedule Jobs<span class="help-block" style="font-size: 9px">Allows user to schedule larger or repeating load jobs</span>', "name": "canrunasync",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Manage Load Jobs<span class="help-block" style="font-size: 9px">Allows edit/delete on all scheduled load jobs (not just the user\'s jobs)</span>', "name": "canmanagejobs",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Manage Load Paths<span class="help-block" style="font-size: 9px">Allows user to add root server paths to be available for loading. <b>This should be a tightly controlled privilege.</b></span>', "name": "canmanagepaths",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Manage Load Profiles<span class="help-block" style="font-size: 9px">Allows user to delete any load profile.</span>', "name": "canmanageprofiles",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        },
        {"type": "checkbox", "label": 'Can Manage Load Privileges<span class="help-block" style="font-size: 9px">Allows access to this page and the ability to add/edit/remove user privileges. <b>This should be a tightly controlled privilege.</b></span>', "name": "canmanageprivileges",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        }
    ],
    colNames: ["userName", "canrunsync", "candousers", "canrunsync", "canrunasync", "canmanagejobs", "canmanagepaths", "canmanageprofiles", "canmanageprivileges"],
    "dgColumnDefs": [
        {"mData": "Action", "sName": "Action", "aTargets": [0], "sTitle": "Action", "sClass": "center", "sType": "html", "sDefaultContent": '&nbsp;<a href="" class="editor_edit">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Remove</a>'},
        {"mData": "userName", "sName": "userName", "aTargets": [1], "sTitle": "User Name", "sClass": "center", "sType": "string"},
        {"mData": "canrunsync", "sName": "canrunsync", "aTargets": [2], "sTitle": "Run Loads", "sClass": "center", "sType": "string"},
        {"mData": "candousers", "sName": "candousers", "aTargets": [3], "sTitle": "Load Users", "sClass": "center", "sType": "string"},
        {"mData": "canrunasync", "sName": "canrunasync", "aTargets": [4], "sTitle": "Schedule Jobs", "sClass": "center", "sType": "string"},
        {"mData": "canmanagejobs", "sName": "canmanagejobs", "aTargets": [5], "sTitle": "Manage Jobs", "sClass": "center", "sType": "string"},
        {"mData": "canmanagepaths", "sName": "canmanagepaths", "aTargets": [6], "sTitle": "Manage Paths", "sClass": "center", "sType": "string"},
        {"mData": "canmanageprofiles", "sName": "canmanageprofiles", "aTargets": [7], "sTitle": "Manage Profiles", "sClass": "center", "sType": "string"},
        {"mData": "canmanageprivileges", "sName": "canmanageprivileges", "aTargets": [8], "sTitle": "Manage Priviliges", "sClass": "center", "sType": "string"}
    ]
});



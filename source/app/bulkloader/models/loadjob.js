define({
    colNames: [],
    "dgColumnDefs": [
        {"mData": "scheduleId", "sName": "scheduleId", "aTargets": [0], "sType": "number", "bVisible": false },
        {"mData": "Action", "sName": "Action", "aTargets": [1], "sTitle": "Row Actions", "sClass": "center", "sType": "html", "sDefaultContent": '&nbsp;<a href="" class="editor_run_now">Run Now</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_editjob">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
        {"mData": "jobname", "sName": "jobname", "aTargets": [2], "sTitle": "Name", "sClass": "center", "sType": "string"},
        {"mData": "jobSubtype", "sName": "jobSubtype", "aTargets": [3], "sTitle": "Load Type", "sClass": "center", "sType": "string"},
        {"mData": "action", "sName": "action", "aTargets": [4], "sTitle": "Action", "sClass": "center", "sType": "string"},
        {"mData": "loadpath", "sName": "loadpath", "aTargets": [5], "sTitle": "Load Path", "sClass": "center", "sType": "string"},
        {"mData": "last_run_datetime", "sName": "last_run_datetime", "aTargets": [6], "sTitle": "Last Run", "sClass": "center", "sType": "date"},
        {"mData": "next_run_datetime", "sName": "next_run_datetime", "aTargets": [7], "sTitle": "Next Run", "sClass": "center", "sType": "date"},
        {"mData": "status", "sName": "status", "aTargets": [8], "sTitle": "Status", "sClass": "center", "sType": "html"}/*,
        {"mData": "History", "sName": "History", "aTargets": [8], "sTitle": "History", "sClass": "center", "sType": "html", "sDefaultContent": '&nbsp;<a href="" class="editor_view_history">View History</a>'}*/
    ]
});



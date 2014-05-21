define({
    colNames: [],
    "dgColumnDefs": [
        {"mData": "scheduleId", "sName": "scheduleId", "aTargets": [0], "sType": "number", "bVisible": false },
        {"mData": "jobType", "sName": "jobType", "aTargets": [1], "sType": "string", "bVisible": false },
        {"mData": "Action", "sName": "Action", "aTargets": [2], "sTitle": "Row Actions", "sClass": "center", "sType": "html", "sDefaultContent": '&nbsp;<a href="" class="editor_run_now">Run Now</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_editjob">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
        {"mData": "jobname", "sName": "jobname", "aTargets": [3], "sTitle": "Name", "sClass": "center", "sType": "string"},
        {"mData": "jobSubtype", "sName": "jobSubtype", "aTargets": [4], "sTitle": "Export Type", "sClass": "center", "sType": "string"},
        {"mData": "last_run_datetime", "sName": "last_run_datetime", "aTargets": [5], "sTitle": "Last Run", "sClass": "center", "sType": "date"},
        {"mData": "next_run_datetime", "sName": "next_run_datetime", "aTargets": [6], "sTitle": "Next Run", "sClass": "center", "sType": "date"},
        {"mData": "status", "sName": "status", "aTargets": [7], "sTitle": "Status", "sClass": "center", "sType": "html"}/*,
        {"mData": "History", "sName": "History", "aTargets": [7], "sTitle": "History", "sClass": "center", "sType": "html", "sDefaultContent": '&nbsp;<a href="" class="editor_view_history">View History</a>'}*/
    ]
});
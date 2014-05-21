define({
    dgEditorFields: [
        {"type": "hidden", "name": "id"},
        {"type": "text", "label": "Name", "name": "name"},
        {"type": "text", "label": "Server Path", "name": "path"},
        {"type": "checkbox", "label": "Enabled", "name": "enabled",
            "ipOpts": [
                { "label": "", "value": "true" }
            ]
        }
    ],
    "dgColumnDefs": [
        {"mData": "id", "sName": "id", "aTargets": [0], "sType": "string", "bVisible": false },
        {"mData": "action", "sName": "action", "aTargets": [1], "sTitle": "Action", "sClass": "center", "sType": "html", "sWidth": "20%", "sDefaultContent": '&nbsp;<a href="" class="editor_edit">Edit</a>&nbsp;&nbsp;&nbsp;<a href="" class="editor_remove">Delete</a>'},
        {"mData": "name", "sName": "name", "aTargets": [2], "sTitle": "Name", "sClass": "center", "sType": "string", "sWidth": "25%" },
        {"mData": "path", "sName": "path", "aTargets": [3], "sTitle": "Server Path", "sClass": "center", "sType": "string", "sWidth": "50%" },
        {"mData": "enabled", "sName": "enabled", "aTargets": [4], "sTitle": "Enabled", "sClass": "center", "sType": "string", "sWidth": "5%" }
    ],
    colNames: ["id", "action", "name", "path", "enabled"]
});

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
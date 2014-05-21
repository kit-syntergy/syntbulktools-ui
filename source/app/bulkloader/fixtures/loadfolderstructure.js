define({
    "page_title" : "Load File Structure",
    "action_buttons": [
        {id : "validateButton", className: "btn btn-small btn-primary btn-now", label: "Validate Only"},
        {id : "loadButton", className: "btn btn-small btn-primary btn-now", label: "Load Now"},
        {id : "scheduleButton", className: "btn btn-small btn-primary", label: "Save Scheduled Job"}
    ],
    grid_label: "Metadata View",
    source_label: "Source View",
    target_label: "Target View",
    help_block: "Note: This page is for loading a file structure intact into Content Server. For single CSV loads with a $TargetPath column, use the 'Load from CSV' option."
});

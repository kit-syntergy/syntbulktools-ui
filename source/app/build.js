var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var shim = require('browserify-shim');

var bundled = browserify({ debug: true })
    .use(shim({ alias: 'app', path: 'app', exports: 'App' }))
    .use(shim({ alias: 'async', path: '../../libs/async/0.2.9/async', exports: 'async' }))
    .use(shim({ alias: 'bootbox', path: '../../libs/bootbox/4.0.0/bootbox.min', exports: 'bootbox' }))
    .use(shim({ alias: 'dynatree', path: '../../libs/dynatree/1.2.4/jquery.dynatree.min', exports: 'DynaTree' }))
    .use(shim({ alias: 'contextMenu', path: '../../libs/contextmenu/1.2.2/jquery.ui-contextmenu.min', exports: null }))
    .use(shim({ alias: 'jquery-cookie', path: '../../libs/jquery/1.9.1/jquery.cookie', exports: null }))
    .use(shim({ alias: 'jquery-ui', path: '../../libs/jquery-ui/1.10.3/jquery-ui.custom.min', exports: null }))
    .use(shim({ alias: 'jeditable', path: '../../libs/jeditable/1.7.1/jquery.jeditable', exports: 'JEditable' }))
    .use(shim({ alias: 'handlebars', path: '../../libs/handlebars/1.0.rc.4/handlebars', exports: 'Handlebars' }))
    .use(shim({ alias: 'datatables', path: '../../libs/datatables/1.9.4/jquery.dataTables', exports: 'DataTable' }))
    .use(shim({ alias: 'routie', path: '../../libs/routie/0.3.2/routie', exports: 'routie' }))
    .use(shim({ alias: 'combobox', path: 'utils/combobox', exports: null }))
    .use(shim({ alias: 'customfile', path: 'utils/customfile', exports: null }))
    .use(shim({ alias: 'CsvParser', path: 'utils/CsvParser', exports: 'CsvParser' }))
    .use(shim({ alias: 'StopWatch', path: 'utils/StopWatch', exports: 'StopWatch' }))
    .use(shim({ alias: 'filereader', path: '/please/replace/with/path/to/filereader.js', exports: 'MyFileReader' }))
    .use(shim({ alias: 'tabletools', path: '../../libs/tabletools/2.1.5/TableTools.min', exports: 'TableTools' }))
    .use(shim({ alias: 'scroller', path: '../../libs/scroller/1.2.0/dataTables.scroller.min', exports: 'scroller' }))
    .use(shim({ alias: 'fixedHeader', path: '/please/replace/with/path/to/fixedHeader.js', exports: 'fixedHeader' }))
    .use(shim({ alias: 'fixedColumns', path: '../../libs/fixedcolumns/1.10.0/dataTables.fixedColumns', exports: 'fixedColumns' }))
    .use(shim({ alias: 'datatablesEditor', path: '../../libs/datatables-editor/dataTables.editor.min', exports: 'Editor' }))
    .use(shim({ alias: 'zeroclipboard', path: '../../libs/tabletools/2.1.5/ZeroClipboard', exports: 'ZeroClipboard_TableTools' }))
    .use(shim({ alias: 'liteAccordion', path: '../../libs/liteaccordion/1.3/liteaccordion.jquery.min', exports: 'liteAccordion' }))
    .addEntry(path.join(__dirname, 'app.js'))
    .bundle();

fs.writeFileSync(path.join(__dirname, 'build/bundle.js'), bundled, 'utf-8');

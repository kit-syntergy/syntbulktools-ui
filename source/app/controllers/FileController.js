define(["jquery", "CsvParser"],
    function ($, CsvParser) {
        /*global App */
        return {
            CsvFileReader: function (receiveDataFunc, refreshFunc, context, callback) {
                var reader = new FileReader();
                var progressBar;
                var that = this;
                reader.onerror = App.ErrorController.handleErrorFromEvent;
                reader.onloadstart = function (evt) {
                    // show a progress bar only for a very large file
                    if (evt.lengthComputable) {
                        //that.progressBar = new App.PageController.ProgressBar(evt.total, "File Read Progress");
                        //that.progressBar.show();
                    }
                };
                reader.onprogress = function (evt) {
                    if (evt.lengthComputable) {
                        //that.progressBar.update(evt.loaded);
                    }
                }
                ;
                reader.onabort = function (e) {
                    alert('File read cancelled');
                    //that.progressBar.finish();
                };
                reader.onload = function (e) {      // success callback
                    var firstLineHeader = true;
                    var result = CsvParser(firstLineHeader).textToCSV(e.target.result, 1000);
                    receiveDataFunc.call(context, result.colNames, result.data, true, callback);
                    refreshFunc.call(result.data, context);
                    //that.progressBar.finish();
                };
                return reader;
            }
        };
    }

);





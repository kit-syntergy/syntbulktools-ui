define(["jquery", "lodash"],
    function ($, _) {
        /*global App */
        /* Usage:
         *  CsvParser().textToCSV()(csvtext)               returns an array of arrays representing the CSV text.
         *  CsvParser("\t").textToCSV(tsvtext)           uses Tab as a delimiter (comma is the default)
         *  CsvParser("\t", "'").textToCSV(tsvtext)      uses a single quote as the quote character instead of double quotes
         *  CsvParser("\t", "'\"").textToCSV(tsvtext)    uses single & double quotes as the quote character
         */

        return function (inFirstLineHeader, inDelim, inQuote, inLineDelim) {
            return {
                delim: typeof inDelim == "string" ? new RegExp("[" + (inDelim || ",") + "]") : typeof inDelim == "undefined" ? "," : inDelim,
                quote: typeof inQuote == "string" ? new RegExp("^[" + (inQuote || '"') + "]") : typeof inQuote == "undefined" ? '"' : inQuote,
                linedelim: typeof inLineDelim == "string" ? new RegExp("[" + (inLineDelim || "\r\n") + "]+") : typeof inLineDelim == "undefined" ? "\r\n" : inLineDelim,
                firstLineHeader: inFirstLineHeader,

                splitLine: function (v) {
                    // Split the line using the delimitor
                    var arr = v.split(this.delim);
                    var out = [];
                    var q;

                    for (var i = 0, l = arr.length; i < l; i++) {
                        if (q = arr[i].match(this.quote)) {
                            for (var j = i; j < l; j++) {
                                if (arr[j].charAt(arr[j].length - 1) == q[0]) {
                                    break;
                                }
                            }
                            var s = arr.slice(i, j + 1).join(this.delim);
                            out.push(s.substr(1, s.length - 2));
                            i = j;
                        }
                        else {
                            out.push(arr[i]);
                        }
                    }

                    return out;
                },
                newBlankLine: function (length) {
                    var newLine = "";
                    for (var i = 0; i < length; i++) {
                        newLine += ',';
                    }
                    return newLine;
                },
                textToCSV: function (text, limit) {
                    var rawLines = text.split(this.linedelim);
                    var data = [];
                    var i = 0;
                    var colNames = [];
                    var retObj = {};

                    _.each(rawLines, function (l) {

                        if (i>limit+1){
                            App.PageController.showInfo("The Desktop CSV limit is " + limit + " lines");
                            retObj.colNames = colNames;
                            retObj.data = data;
                            return retObj;
                        }

                        var vals = this.splitLine(l);
                        var line = {};

                        if (this.firstLineHeader && i == 0) {
                            // *** add some standard fields to the columns
                            vals.splice(0, 0, "Action");
                            vals.splice(1, 0, "Line");
                            vals.splice(2, 0, "Status");
                            colNames = vals;
                        }
                        else {
                            vals.splice(0, 0, '<a href="" class="editor_edit">Edit</a>');
                            vals.splice(1, 0, i - 1);
                            vals.splice(2, 0, '');
                            // any lines that do not have the right number of columns we have to throw out
                            if (vals.length != colNames.length) {
                                //log("Invalid number of columns in line " + i + " from CSV. Line = " + vals);
                            } else if (this.firstLineHeader) {
                                var j = 0;
                                _.each(colNames, function (c) {
                                    line[c] = vals[j];
                                    j++;
                                }, this);
                                data.push(line);
                            } else {      // no col names-- we have to return a 2D array
                                data.push(vals);
                            }
                        }
                        i++;
                    }, this);
                    retObj.colNames = colNames;
                    retObj.data = data;
                    return retObj;
                }
            }
        }
    });

define(['bootbox', 'StopWatch', 'lodash', 'text!templates/form_modal.html', "combobox", "popup", "ProgressBar"],
    function (bootbox, StopWatch, _, modalFormTemplate, combobox, popup, ProgressBar) {
        /*global App*/
        /*global LOAD_EXPORT_SYNC_LIMIT*/
        return {
            filePath: null,
            folderPath: null,
            gridDivId: "grid_div",
            totalNumItems: 0,
            pageType: '',
            actionToPerform: '',
            hasResultsToClear: false,
            hasValidationErrors: false,
            isValidForLoadExport: true,
            profileModel: null,
            colNames: [],
            initPage: function (formVals, triggerChanges) {

                //$("span.custom-combobox").hide();

                // do all the accordion elements
                $("#advancedDiv").accordion({
                    collapsible: true,
                    active: false,
                    heightStyle: 'content'
                });
                $("#nameCollisonDiv").accordion({
                    collapsible: true,
                    active: false,
                    heightStyle: 'content'
                });
                // hide the border on grid so it doesn't look funny
                $("#grid_div").addClass("hideBorder");

                $('#progressDiv').modal({
                    keyboard: false,
                    backdrop: false,
                    show: false
                });

                $('input[type="radio"][name="whenOption"]').click(function (e) {
                    App.PageController.processWhenChange();
                });

                this.setFormVals(formVals, ['myform', 'myform_adv', 'schedule_form'], triggerChanges);

                // formVals may have set async option
                App.PageController.processWhenChange();

                // disable action buttons
                App.PageController.disableActionButtons();

            },
            setFormVals: function (formVals, formNames, triggerChanges) {
                // set form vals into page if we have them
                var p = App.PageController;
                var alreadySet = [];
                // determine whether to loop through formVals or formElements
                if (formVals) {
                    var keys = _.keys(formVals);
                    if (keys.length > 10) {
                        _.each(formNames, function (formName) {
                            // get the inputs in this form
                            _.each($("#" + formName + " input,select,textarea"), function (el) {
                                if (!_.contains(alreadySet, el.name)) {
                                    var val = formVals[el.id] || formVals[el.name];
                                    if (typeof val != 'undefined') {
                                        alreadySet.push(el.name);
                                        p.setFormVal($(el), val, el.name, triggerChanges);
                                    }
                                }
                            })
                        });
                    }
                    else {
                        _.each(keys, function (name) {
                            var val = formVals[name];
                            //log("name=" + name + " val=" + val);
                            _.any(formNames, function (formName) {
                                var inputObj1 = $("#" + formName + " #" + name);
                                if (inputObj1.length) {
                                    p.setFormVal(inputObj1, val, name, triggerChanges);
                                    return true;
                                }
                                var inputObj2 = $("#" + formName + " [name='" + name + "']");
                                if (inputObj2.length) {
                                    p.setFormVal(inputObj2, val, name, triggerChanges);
                                    return true;
                                }
                            });
                        });
                    }
                }
            },
            setFormVal: function (inputObj, val, name, triggerChanges) {
                //log("setting " + name + " to value " + val);
                // is there a setter for this field?  If so, call it
                var setter = "set" + App.PageController.initCap(name);
                var setterFunc = App.PageController[setter];
                if (setterFunc && val != null && typeof val != 'undefined' && val.length) {
                    setterFunc(val, triggerChanges);
                }
                else {
                    switch (inputObj.prop('tagName')) {
                        case 'INPUT':
                            switch (inputObj.attr('type')) {
                                case 'hidden':
                                case 'text':
                                case 'number':
                                    inputObj.val(val);
                                    break;
                                case 'time':
                                case 'date':
                                case 'datetime':
                                    if (val != null && typeof val != 'undefined' && val.length) {
                                        inputObj.val(val);
                                    }
                                    break;
                                case 'checkbox':
                                    if (val && val !== 'false' && val != '') {
                                        inputObj.prop('checked', true);
                                    }
                                    else {
                                        inputObj.prop('checked', false);
                                    }
                                    break;
                                case 'radio':
                                    inputObj.prop('checked', false);
                                    $("input[name='" + name + "'][value='" + val + "']").prop('checked', true);
                                    break;
                            }
                            break;
                        case 'SELECT':
                            inputObj.val(val);
                            break;
                    }
                    if (name !== "profileId" && triggerChanges) {      // *** important without this conditional, you end up with infinite loop
                        //log("would be triggering change on " + name);
                        inputObj.trigger("change");
                    }
                }
            },
            initCap: function (s) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            },
            setSelectOptions: function (model, valKey, displayKey, selectId, funcToCall, params, set1stValue, callback) {
                App.PageController.hideElement(selectId);
                $.when(funcToCall(model, params, false))
                    .done(function (data) {
                        _.each(data, function (o) {
                            $("#" + selectId).append($("<option>")
                                .val(o[valKey])
                                .html(o[displayKey])
                                .attr('data', JSON.stringify(o))
                            );
                        }, this);
                        App.PageController.showElement(selectId);
                        var children = $("#" + selectId).children();
                        if (children.length && set1stValue) {
                            $("#" + selectId).val(children[0].value);
                            $("#" + selectId).trigger("change");
                        }
                        if (callback) {
                            callback();
                        }

                    })
                    .fail(function (errMsg) {
                        App.PageController.showError(errMsg);
                    });
            },
            forwardToPage: function (module, page, formVals, triggerChanges) {
                App.Router.switchPage(module, page, formVals, true, triggerChanges);
            },
            ensureDirSeparator: function (path) {
                if (path.substring(path.length - 1) != "\\") {
                    path += "\\"
                }
                return path;
            },
            isCsvPath: function (path) {
                return path.substring(path.length - 3).toUpperCase() == "CSV"
            },
            isUserCsv: function (path) {
                var isUser = _.contains(path.toUpperCase(), "USER");
                var isGroup = _.contains(path.toUpperCase(), "GROUP");
                return isUser || isGroup;
            },
            isFolderPath: function (path) {
                return path.substring(path.length - 1) == "/" || path.substring(path.length - 1) == "\\";
            },
            serializeFormVals: function (getScheduleForm) {
                var s = $("#myform").serialize() + "&" + $("#myform_adv").serialize();
                if (getScheduleForm) {
                    s += $("#schedule_form").length ? "&" + $("#schedule_form").serialize() : '';
                }
                return s;
            },
            serializeFormValsArray: function () {
                var arr1 = $("#myform").serializeArray();
                var arr2 = $("#myform_adv").serializeArray();
                var u = _.union(arr1, arr2);
                if ($("#formModal").length) {
                    u = _.union(u, $("#formModal").serializeArray());
                }
                return u;
            },
            enableElement: function (id) {
                $("#" + id).prop('disabled', false);
            },
            disableElement: function (id) {
                $("#" + id).prop('disabled', true);
            },
            hideElement: function (id) {
                $("#" + id).hide();
            },
            showElement: function (id) {
                $("#" + id).show();
            },
            showGrid: function () {
                this.showElement(this.gridDivId);
            },
            hideGrid: function () {
                this.hideElement(this.gridDivId);
            },
            enableActionButtons: function () {
                $("button.btn-now").prop('disabled', false);
            },
            disableActionButtons: function () {
                $("button.btn-now").prop('disabled', true);
            },
            activatePrimaryButton: function (ids) {
                $("button.btn-now").removeClass("btn-primary");
                _.each(ids, function (id) {
                    $("#" + id).addClass("btn-primary");
                });
            },
            reloadGrid: function () {

            },
            gridLoadDone: function () {
                $("#grid_div").removeClass("hideBorder");
                App.PageController.showGrid();
            },
            showError: function (msg) {
                popup._alert(msg, "alert-error");
            },
            showWarning: function (msg) {
                popup._alert(msg, "alert-warning");
            },
            showInfo: function (msg, autoClose) {
                popup._alert(msg, "alert-info", autoClose);
            },
            showSuccess: function (msg) {
                popup._success(msg, "alert-success");
            },
            showLoadingIndicator: function (title, backdrop, clockSeconds) {
                title = title || "Processing";
                var progressBar = new ProgressBar(title, 0, clockSeconds);
                progressBar.show();
                return progressBar;
            },
            confirm: function (question, callback) {
                popup._confirm(question, function (result) {
                    //defer the execution so we can immediately return (avoid having the dialog hanging on screen)
                    setTimeout(function () {
                        callback(result)
                    }, 100);
                    return true;
                }, "Confirm");
            },
            hideLoadingIndicator: function () {
                popup._hideAlerts();
            },

            updateJobStatus: function () {
                // button to update job status
                $(".jobstatus_refresh").each(function (index) {
                    var element = this;
                    var id = $(this).attr('id');
                    var scheduleId = id.substr(id.indexOf("_") + 1);
                    $("#" + id).click(function (e) {
                        var el = $("#jobstatus_" + scheduleId);
                        el.html('<div id="mybar" class="progress-img" style="width: 50%; text-align: middle"></div>')
                        $.when(App.ServerAPI.getJobStatusHtml(scheduleId))
                            .done(function (result) {
                                el.html(result);
                            })
                            .fail(function (errMsg, context) {
                                log(errMsg)
                                el.html('');
                            });
                    });
                });
            },
            checkFilePath: function (filePath, showError, successCallback, errorCallback) {
                $.when(App.ServerAPI.checkFilePath(filePath, this))
                    .done(function (result, context) {
                        if (successCallback) {
                            successCallback(filePath)
                        }
                    })
                    .fail(function () {
                        if (errorCallback) {
                            errorCallback(showError)
                        }
                    });
            },
            checkFolderPath: function (folderPath, showError, successCallback, errorCallback) {
                $.when(App.ServerAPI.checkFolderPath(folderPath, this))
                    .done(function (result, context) {
                        if (successCallback) {
                            successCallback(folderPath)
                        }
                    })
                    .fail(function () {
                        if (errorCallback) {
                            errorCallback(showError)
                        }
                    });
            },
            closeModalWindow: function () {
                popup._hideAlerts();
            },
            openModalWindow: function (msg, title, closeButton, className, buttons, height, width, callback) {
                if (height) {
                    $(".bootbox").css("height", height);
                }
                if (width) {
                    $(".bootbox").css("width", width);
                }
                popup._dialog(msg, title, closeButton, className, false, false, buttons);
                if (callback) {
                    callback();
                }
            },
            updateModalWindow: function (rootDivId, msg, title, height, width) {
                $(".bootbox").css("height", height);
                $(".bootbox").css("width", width);
                $('#' + rootDivId).html(msg);
                $('.modal-header').html(title);
            },
            updatePopupWindow: function (rootDivId, msg, title, height, width) {
                $(".bootbox").css("height", height);
                $(".bootbox").css("width", width);
                $('#' + rootDivId).html(msg);
                $('.modal-header').html(title);
            },
            hideAlerts: function () {
                popup._hideAlerts();
            },
            openModalForm: function (formName, title, pageTemplate, height, width, saveCallback, closeCallback) {
                var baseTemplate = Handlebars.compile(modalFormTemplate);
                Handlebars.registerPartial("page_content1", pageTemplate);
                var html = baseTemplate({form_id: formName, form_name: formName});
                var buttons = {
                    save: {
                        label: "Save",
                        className: "btn-primary",
                        callback: saveCallback
                    },
                    cancel: {
                        label: "Cancel",
                        className: "btn",
                        callback: closeCallback
                    }
                };
                this.openModalWindow(html, title, true, "modal_form", buttons, height, width);
            },

            canEnableActionButtons: function () {
                return false;
            },
            updatePage: function () {
                if (App.PageController.canEnableActionButtons()) {
                    this.enableActionButtons();
                } else {
                    this.disableActionButtons();
                }
            },
            isNow: function () {
                var when = $("input:radio[name=whenOption]:checked").val();
                return when === "now"
            },
            isScheduled: function () {
                var when = $("input:radio[name=whenOption]:checked").val();
                return when === "async"
            },
            processWhenChange: function () {
                var when = $("input:radio[name=whenOption]:checked").val();
                switch (when) {
                    case "now":
                        this.hideElement("scheduleDiv");
                        this.hideElement("scheduleButton");
                        this.showElement("validateButton");
                        this.showElement("loadButton");
                        this.showElement("exportButton");
                        this.showElement("grid_div");
                        this.showElement("targetContainer");
                        this.showElement("sourceContainer");
                        break;
                    case "async":
                        this.showElement("scheduleDiv");
                        this.showElement("scheduleButton");
                        this.hideElement("loadButton");
                        this.hideElement("exportButton");
                        this.hideElement("validateButton");
                        this.hideElement("grid_div");
                        this.hideElement("targetContainer");
                        this.hideElement("sourceContainer");
                        App.JobScheduleController.openSchedulerForm();
                        break;
                }
            },
            checkTotalNumItems: function (num) {
                var limit = LOAD_EXPORT_SYNC_LIMIT;
                if (this.isNow()) {
                    // we will hide and enable these buttons depending on whether number is less/greater than limit
                    //  then we call update page where the buttons are further fine-tuned depending on async and validation
                    if (num <= limit) {
                        this.showElement("loadButton");
                        this.showElement("exportButton");
                        this.enableElement("nowOption");
                        return true;
                    } else {
                        this.hideElement("loadButton");
                        this.hideElement("exportButton");
                        this.disableElement("nowOption");
                        this.showInfo("Loads or Exports greater than " + limit + " items  must be done asynchronously.");
                        $("#asyncOption").prop("checked", true);
                        $('input[type="radio"][name="whenOption"]').trigger("click");
                        return false;
                    }
                } else {
                    return false;
                }
            },
            setTotalNumItems: function (num) {
                App.PageController.totalNumItems = num;
            },
            ProgressBar: function (title, total) {
                return new ProgressBar(title, total);
            },
            setEnd_date: function (val) {
                val = new Date(val);
                val = App.JobScheduleController.getDateStrFromDate(val);
                $('#end_date').val(val);
            },
            setStart_date: function (val) {
                val = new Date(val);
                val = App.JobScheduleController.getDateStrFromDate(val);
                $('#start_date').val(val);
            },
            setOne_time_date: function (val) {
                val = new Date(val);
                val = App.JobScheduleController.getDateStrFromDate(val);
                $('#one_time_date').val(val);
            }
        };
    });


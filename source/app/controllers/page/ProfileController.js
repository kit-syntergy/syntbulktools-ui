define(["jquery", "RootPageController"],
    function ($, RootPageController) {
        return {
            /*global App*/
            initPage: function () {
                $("#profileId").on("change", function (evt) {
                    //log("profileChange");
                    var s = evt.target;
                    var selOption = $(s.options[s.selectedIndex]);
                    var data = selOption.attr('data');
                    data = JSON.parse(data);
                    App.PageController.setFormVals(data, ['myform', 'myform_adv'], true);
                });

                $("#saveProfileButton").click(function (e) {
                    e.preventDefault();
                    var selObj = $("#profileId");
                    var existingId = selObj.val();
                    var optionVal = $("#profileId").find("option:selected").text();
                    var newId = $("#newProfileId").val();
                    //log("existingId=" + existingId);
                    //log("newId=" + newId);
                    if (existingId && existingId != "null") {
                        App.PageController.confirm("Save these form values under the '" + optionVal + "' profile?",
                            function (result) {
                                if (result) {
                                    App.ProfileController.saveProfile(function () {
                                        App.PageController.showSuccess("Profile successfully saved.")
                                    }, null);
                                }
                            })
                    } else if (newId.length) {
                        App.PageController.confirm("Save these form values under a new profile named '" + newId + "'?",
                            function (result) {
                                if (result) {
                                    App.ProfileController.addProfile(function (pData) {
                                        $("#profileId").append($("<option>")
                                            .val(pData.profileId)
                                            .html(pData.profileId)
                                            .attr('data', JSON.stringify(pData))
                                        );
                                        $("#profileId").val(pData.profileId);
                                        $("#profileId").combobox();
                                        $("#toggle").click(function () {
                                            $("#profileId").toggle()
                                        });
                                        App.PageController.showSuccess("Profile successfully saved.")
                                    });
                                }
                            })
                    }
                    else {
                        App.PageController.showError("Please enter a name for the profile in the box to the left.");
                    }

                });
            },
            saveProfile: function (callback) {
                var type = $('#jobType').val();
                var subType = $('#jobSubtype').val();
                var optionStr = App.PageController.serializeFormVals(true);
                var model = App.PageController.profileModel;
                $.when(App.ServerAPI.saveProfile(type, subType, optionStr, model, this))
                    .done(function (result, context) {
                        if (callback) {
                            callback(result);
                        }
                    })
                    .fail(function (errMsg, context) {
                        App.PageController.showError(errMsg);
                    })
            },
            addProfile: function (callback) {
                var type = $('#jobType').val();
                var subType = $('#jobSubtype').val();
                var optionStr = App.PageController.serializeFormVals(true);
                $.when(App.ServerAPI.addProfile(type, subType, optionStr, this))
                    .done(function (result, context) {
                        if (callback) {
                            callback(result);
                        }
                    })
                    .fail(function (errMsg, context) {
                        App.PageController.showError(errMsg);
                    })
            }
        }

    });
define(["jquery", "lodash", "popup"],
    function ($, _, popup) {
        return function (title, total, clockSeconds) {
            total = total || 0;
            clockSeconds = clockSeconds || 0;
            /*global App*/
            if (total > 0) {
                return{
                    total: total,
                    updateInterval: 1,
                    title: title,
                    numDone: 0,
                    finished: false,
                    stopWatch: new StopWatch(),
                    update: function (increment) {
                        increment = increment || 1;
                        this.numDone += increment;
                        var percent = (this.numDone / this.total) * 100;
                        var rate = this.stopWatch.getDurationSeconds() / this.numDone;
                        rate = rate.toFixed(3);
                        var remainingSecs = Math.round(rate * (this.total - this.numDone));
                        var remainingStr;
                        if (remainingSecs > 3600) {
                            remainingStr = (remainingSecs / 3600).toFixed(2) + " hours";
                        }
                        else if (remainingSecs > 60) {
                            remainingStr = Math.round(remainingSecs / 60).toFixed(2) + " minutes";
                        }
                        else {
                            remainingStr = remainingSecs + " seconds";
                        }
                        $("#mybar").css("width", percent + '%');
                        $("#completed").html(this.numDone + " out of " + this.total + " items completed.");
                        $("#elapsed").html(this.stopWatch.getDurationStr() + " elapsed time");
                        $("#rate").html(rate + " seconds per item");
                        $("#estimatedTime").html(remainingStr + " estimated remaining time");

                    },
                    show: function (backdrop) {
                        backdrop = typeof backdrop == "undefined" ? false : backdrop;
                        this.stopWatch.start();
                        popup._dialog('<div class="progress"><div id="mybar" class="bar" style="width: 1%"></div></div>' +
                            '<div class="timings"><div id="completed"></div><div id="elapsed"></div><div id="rate"></div><div id="estimatedTime"></div>' +
                            '</div>',
                            title || "Progress",
                            false,
                            null,
                            false,
                            backdrop,
                            {  success: {
                                label: "Cancel Process",
                                className: "btn",
                                callback: function () {
                                    App.ProcessController.cancel();
                                    $('.modal-title').html('Cancelling Remainder...');
                                }}
                            }
                        );
                    },
                    finish: function () {
                        this.update(this.total - this.numDone);
                        popup._hideAlerts();
                        this.finished = true;
                    },
                    isFinished: function () {
                        return this.numDone >= this.total;
                    }
                }
            }
            else if (clockSeconds > 0) {
                return {
                    title: title,
                    clockSeconds: clockSeconds,
                    show: function (backdrop) {
                        backdrop = typeof backdrop == "undefined" ? false : backdrop;
                        var msg = 'Estimated time is <span id="secondsSpan">' + clockSeconds + '</span> seconds.<br><br>';
                        msg += '<div id="mybar" class="progress-img" style="width: 100%; text-align: middle"></div>';
                        popup._dialog(msg,
                            title || "Processing",
                            false,
                            "loadingIndicator",
                            false,
                            backdrop
                        );
                        $(".modal-title").css("text-align", "center");
                    },
                    finish: function () {
                        popup._hideAlerts();
                    },
                    updateClock: function () {
                        this.clockSeconds -= 1;
                        $("#secondsSpan").html(this.clockSeconds);
                    }
                }
            }
            else {
                return{
                    title: title,
                    show: function (backdrop) {
                        backdrop = typeof backdrop == "undefined" ? false : backdrop;
                        var msg = '<div id="mybar" class="progress-img" style="width: 100%; text-align: middle"></div>';
                        popup._dialog(msg,
                            title || "Processing",
                            false,
                            "loadingIndicator",
                            false,
                            backdrop
                        );
                        $(".modal-title").css("text-align", "center");
                    },
                    finish: function () {
                        popup._hideAlerts();
                    }
                }
            }

        }

    });
define(["jquery", "lodash"],
    function ($, _) {
        return {
            _alert: function (msg, className, autoClose) {
                this._hideAlerts();
                bootbox.dialog({
                    message: msg,
                    backdrop: false,
                    className: className,
                    animate: false});
                $(".modal-body").addClass(className);
                if (autoClose){
                    $(".bootbox").delay(3000).fadeOut(800);
                }
            },
            _success: function (msg, className) {
                this._hideAlerts();
                bootbox.dialog({
                    message: msg,
                    backdrop: false,
                    className: className,
                    closeButton: true});
                $(".modal-body").addClass(className);
                $(".bootbox").delay(2500).fadeOut(800);
            },
            _dialog: function (msg, title, closeButton, className, animate, backdrop, buttons) {
                this._hideAlerts();
                bootbox.dialog({
                    message: msg,
                    title: title,
                    backdrop: backdrop,
                    className: className,
                    closeButton: closeButton,
                    animate: false,
                    buttons: buttons});
            },
            _confirm: function (msg, callback, title, className) {
                this._hideAlerts();
                return bootbox.confirm({
                    message: msg,
                    title: title || "Confirm",
                    backdrop: false,
                    className: className,
                    closeButton: false,
                    animate: false,
                    callback: callback
                });
            },
            _hideAlerts: function () {
                bootbox.hideAll();
            }
        }

    });
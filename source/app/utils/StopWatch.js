function StopWatch() {

    var startTime = null;
    var stopTime = null;
    var running = false;

    this.start = function () {

        if (running == true)
            return;
        else if (startTime != null)
            stopTime = null;

        running = true;
        startTime = getTime();
    };

    this.stop = function () {

        if (running == false)
            return;

        stopTime = getTime();
        running = false;
    };

    this.getDurationSeconds = function () {
        var ms;
        if (startTime == null)
            ms = 0;
        else if (stopTime == null)
            ms = (getTime() - startTime);
        else
            ms = (stopTime - startTime);
        var seconds = ms / 1000;
        return seconds
    };

    this.getDurationStr = function () {
        var seconds = this.getDurationSeconds();

        if (seconds > 3600) {
            return (seconds / 3600) + " hours";
        }
        else if (seconds > 60) {
            return (seconds / 60) + " minutes";
        }
        else {
            return seconds + " seconds";
        }
    };

    this.isRunning = function () {
        return running;
    };

    function getTime(){
        var day = new Date();
        return day.getTime();
    }


}
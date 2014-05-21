define({
    toOScript: function (val) {
        switch (typeof val) {
            case "undefined":
                break;
            case "function":
                break;
            case "unknown":
                break;
            case "object":
                if (val) {
                    if (typeof val.toOScript === "function") {
                        return val.toOScript();
                    } else {
                        var a = [], i, v, obj = val;
                        for (i in obj) {
                            if (obj.hasOwnProperty(i)) {
                                if (typeof i == "string") {
                                    if (/^-?[0-9]*\.[0-9]+$/.test(i)) {
                                        i = parseFloat(i);
                                    } else {
                                        if (/^-?[0-9]+$/.test(i)) {
                                            i = parseInt(i, 10);
                                        }
                                    }
                                }
                                v = obj[i];
                                switch (typeof v) {
                                    case "undefined":
                                        break;
                                    case "function":
                                        break;
                                    case "unknown":
                                        break;
                                    case "object":
                                        if (v) {
                                            if (typeof v.toOScript === "function") {
                                                a.push("'" + i + "'" + "=" + v.toOScript());
                                            } else {
                                                a.push("'" + i + "'" + "=" + this.toOScript(v));
                                            }
                                        } else {
                                            a.push("'" + i + "'" + "=" + "?");
                                        }
                                        break;
                                    default:
                                        a.push("'" + i + "'" + "=" + v.toOScript());
                                }
                            }
                        }
                        return "A<1,?," + a.join(",") + ">";
                    }
                } else {
                    return "?";
                }
                break;
            default:
                if (typeof val.toOScript === "function") {
                    return val.toOScript();
                }
        }

        return val;
    }
});




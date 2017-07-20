var _ = require("lodash");

exports.createValidate = function(reqr) {
    return function(obj) {
        var result = [];

        function inner(path) {
            var r = path ? _.get(reqr, path) : reqr;
            var o = path ? _.get(obj, path) : obj;
            if (typeof r == "function") {
                return r(o, obj);
            }
            var keys = _.keys(r);
            for (var i = 0; i < keys.length; i++) {
                var p = [path, keys[i]].join(".");
                var ret = inner(p);
                if (ret != null) {
                    result.push(ret);
                }
            }
        }
        inner();
        return result.length ? result : null;
    }
}

exports.re = function(re, msg) {
    if (!re instanceof RegExp) {
        throw new Error("Must Set RegExp And String Arguments");
    }
    msg = msg || "输入格式错误";
    return function(value) {
        if (value == null || !re.test(value)) {
            return msg;
        }
    }
}

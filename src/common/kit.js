var _ = require("lodash");
// var Alert = require("/element/Alert");
// var Loading = require("/element/Loading");

exports.debug = function() {

}
exports.keyObject = function(obj) {
    if (obj == undefined) {
        return { _key: Math.random() };
    }
    if (_.isPlainObject(obj) && !obj._key) {
        obj._key = Math.random();
    }
    return recursive(obj);

    function recursive(obj) {
        if (_.isPlainObject(obj)) {
            for (var name in obj) {
                recursive(obj[name]);
            }
        } else if (_.isArray(obj)) {
            obj.map(function(item) {
                recursive(item);
                if (!item._key) {
                    item._key = Math.random();
                }
            })
        }
        return obj;
    }
}

exports.errorHandler = function(res) {
    try {
        var message = JSON.parse(res.responseText).message;
    } catch (ex) {}
    message = message || "请求出错，请按F5刷新后重试";
    Alert(message);
}

exports.ajax = function(opt) {
    var loading = new Loading();
    $.ajax(_.defaults({
        success: function(res) {
            opt.success && opt.success(res);
            loading.hide();
        },
        error: function(res) {
            opt.error ? opt.error(res) : exports.errorHandler(res);
            loading.hide();
        }
    }, opt));
}

//删除指定字段
exports.clear = function(obj, keys) {
    var json = JSON.stringify(obj, function(key, value) {
        if (keys.indexOf(key) >= 0) {
            return undefined;
        } else {
            return value;
        }
    })
    return JSON.parse(json);
}

//复制指定字段
exports.copy = function(obj, keys) {
    var air = {};
    var key = "";
    for (key in obj) {
        if (keys.indexOf(key) >= 0) {
            air[key] = obj[key];
        }
    };
    return air;
}

exports.decodeObject = function(str) {
    var obj = {};
    _(str).split("&").map(function(kv) {
        kv = kv.split("=");
        if (!kv[0] || !kv[1]) {
            return;
        }
        _.set(obj, decodeURIComponent(kv[0]), decodeURIComponent(kv[1]))
    }).value();
    return obj;
}

function encodeObject(obj, res, prefix) {
    if (obj == null) {
        var kv = prefix + "=";
        res.push(kv)
    } else if (_.isArray(obj)) {
        obj.map(function(item, i) {
            var path = prefix + "[" + i + "]";
            encodeObject(item, res, path)
        })
    } else if (typeof obj == "object") {
        _(obj).keys().map(function(key) {
            var value = obj[key]
            var path = prefix ? prefix + "." + key : key
            encodeObject(value, res, path)
        }).value()
    } else {
        var kv = prefix + "=" + obj;
        res.push(kv)
    }
}
exports.encodeObject = function(obj) {
    var res = [];
    var prefix = "";
    encodeObject(obj, res, prefix);
    return res.join("&");
}

exports.openWindow = function(url) {
    var id = "link-" + parseInt(Math.random() * 1000000);
    var a = document.getElementById(id);
    if (!a) {
        a = document.createElement('a');
        document.body.appendChild(a);
    }
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('id', id);
    a.click();
}

exports.joinClassName = function() {
    return _.flattenDeep(arguments).join(" ")
}

exports.debug = function() {

}

if (require.main == module) {
    var url = "continentID=18&countryID=334&stateID=495&cityID=14434&checkOutDate=2017-06-11&checkInDate=2017-06-10&destinationID=7263&roomsInformation.roomInfo[0].adultNum=2&roomsInformation.roomInfo[0].childNum=2&roomsInformation.roomInfo[0].childAges.childAge[0].age=10&roomsInformation.roomInfo[0].childAges.childAge[1].age=5&roomsInformation.roomInfo[1].adultNum=4&roomsInformation.roomInfo[1].childNum=1&roomsInformation.roomInfo[1].childAges.childAge[0].age=12";
    var res = exports.decodeObject(url)
    console.log(JSON.stringify(res, null, 2));
}

var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
var Modal = require("../Modal");
var Promise = require("bluebird");

module.exports = function(msg, header) {
    var id = "container-confirm-" + Math.floor(Math.random() * 10000);
    var node = $("<div id='" + id + "'></div>");
    $("#container").append(node);

    return new Promise(function(resolve, reject) {
        header = header || "确认";
        var popup = jade(`
        Modal(header={header} onSubmit={resolve.bind(null, true)} onCancel={resolve.bind(null, false)})
            div(style={{minWidth:"250px"}})
                |{msg}
        `);
        ReactDOM.render(popup, document.getElementById(id));
    }).finally(function() {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
        document.getElementById("container").removeChild(document.getElementById(id));
    })
}

var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
require("./style.less")

module.exports = function(msg, args) {
    args = args || {};
    var id = "container-msgs-" + Math.floor(Math.random() * 10000);
    var node = $("<div id='" + id + "'></div>");
    $("#container").append(node);

    function cancel() {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
        document.getElementById("container").removeChild(document.getElementById(id));
    }
    var popup = jade(`
            div(className="CCH-MSGS")
                div(className="msgs-content")
                    |{msg}
            `);
    ReactDOM.render(popup,document.getElementById(id));
    args.time = args.time || 1500;
    setTimeout(cancel, args.time);
}

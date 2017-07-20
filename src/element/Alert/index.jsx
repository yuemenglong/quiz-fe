var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
var Modal = require("../Modal");

module.exports = function(msg, title) {
    title = title || "提示";
    var id = "container-alert-" + Math.floor(Math.random() * 10000);
    var node = $("<div id='" + id + "'></div>");
    $("#container").append(node);

    function submit() {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
        document.getElementById("container").removeChild(document.getElementById(id));
    }
    var popup = jade(`
        Modal(header={title} onSubmit={submit})
            div(style={{minWidth:"250px"}})
                |{msg}
        `);
    ReactDOM.render(popup, document.getElementById(id));
}

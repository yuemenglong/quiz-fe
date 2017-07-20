var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
var Modal = require("../Modal");

module.exports = function(msg) {
    var id = "container-alert-" + Math.floor(Math.random() * 10000);
    var node = $("<div id='" + id + "'></div>");
    $("#container").append(node);

    function cancel() {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
        document.getElementById("container").removeChild(document.getElementById(id));
    }
    var popup = jade(`
        Modal(header="提示")
            div(style={{minWidth:"250px"}})
                |{msg}
        `);
    ReactDOM.render(popup, document.getElementById(id));
    setTimeout(cancel, 500);
}

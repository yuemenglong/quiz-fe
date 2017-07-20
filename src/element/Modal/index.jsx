var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

//- div(className="btn-group cch-modal-btn")
//- button(className="btn btn-lg btn-primary") 确定
//- button(className="btn btn-lg btn-default") 取消*/

//{header[], body[[],[]], }
function ModalClass() {
    this.onCancel = function() {
        this.props.onCancel && this.props.onCancel();
    }
    this.onSubmit = function() {
        this.props.onSubmit && this.props.onSubmit();
    }
    this.onClose = function() {
        this.props.onClose && this.props.onClose();
    }
    this.renderSubmit = function() {
        if (!this.props.onSubmit) {
            return;
        }
        var text = this.props.submitText || "确定";
        var className = this.props.submitClassName ? "btn btn-green" + this.props.submitClassName : "btn btn-green";
        return jade(`button(className={className} onClick={this.onSubmit}) {text}`);
    }
    this.renderCancel = function() {
        if (!this.props.onCancel) {
            return;
        }
        var text = this.props.cancelText || "取消";
        var className = this.props.cancelClassName ? "btn " + this.props.cancelClassName : "btn ";
        return jade(`button(className={className} onClick={this.onCancel}) {text}`);
    }
    this.renderClose = function() {
        if (!this.props.onClose) {
            return;
        }
        return jade(`button(className="btn btn-red btn-close" onClick={this.onClose})`);
    }
    this.renderFooter = function() {
        if (this.props.renderButton) {
            return jade(`
                div(className="modal-footer")
                    |{this.props.renderButton()}
                `);
        } else if (this.props.onCancel || this.props.onSubmit) {
            return jade(`
                div(className="modal-footer")
                    |{this.renderCancel()}
                    |{this.renderSubmit()}
                `);
        }
    }
    this.render = function() {
        var body = this.props.children && this.props.children;
        var className = "cch-modal " + this.props.className;
        return jade(`
            div(className={className} style={this.props.style})
                div(className="modal-content")
                    div(className="modal-header")
                        div(className="modal-title") {this.props.header}
                        |{this.renderClose()}
                    div(className="modal-body")
                        |{body}
                    |{this.renderFooter()}
            `);
    }
}

var Modal = React.createClass(new ModalClass());

module.exports = Modal;
module.exports.show = function(body, props) {
    var id = "container-modal-" + Math.floor(Math.random() * 10000);
    var ret = {};
    ret.show = function() {
        var node = $("<div id='" + id + "'></div>");
        $("#container").append(node);
        var modal = jade(`
            Modal({...props})
                |{body}
            `);
        ReactDOM.render(modal, document.getElementById(id));
    }.bind(ret);
    ret.hide = function() {
        ReactDOM.unmountComponentAtNode(document.getElementById(id));
        document.getElementById("container").removeChild(document.getElementById(id));
    }.bind(ret);

    ["onSubmit", "onCancel", "onClose"].map(function(name) {
        if (props && props[name] === true) {
            props[name] = ret.hide;
        }
    }.bind(ret))
    ret.show();

    return ret;
}

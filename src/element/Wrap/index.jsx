var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

function WrapClass() {
    this.getInitialState = function() {
        return { focus: false };
    }
    this.onFocus = function(e) {
        this.setState({ focus: true });
    }
    this.onBlur = function() {
        this.setState({ focus: false });
    }
    this.toName = function(arg) {
        var blue = arg.search("cch-wrap-blue") >= 0;
        var red = arg.search("cch-wrap-red") >= 0;
        var idefault = arg.search("cch-wrap-default") >= 0;

        if (blue || red || idefault) {
            return arg;
        } else {
            return arg + " cch-wrap-default";
        }
    }
    this.getClassName = function() {
        var ret = "";
        ret = (this.props.className || "") + " cch-wrap";
        if (this.state.focus) {
            ret = ret + " cch-wrap-focus";
        }
        return this.toName(ret);
    }
    this.getPropsFocus = function() {
        //useCapture 使用捕获
        if (this.props.useCapture) {
            return {
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                onMouseOver: this.onMouseOver,
                onMouseOut: this.onMouseOut,
            };
        }
        return {};
    }
    this.render = function() {
        return jade(`
            div(className={this.getClassName()} {...this.getPropsFocus()})
                span(className="cch-wrap-title") {this.props.title}
                |{this.props.children}
            `);
    }
}

module.exports = React.createClass(new WrapClass());

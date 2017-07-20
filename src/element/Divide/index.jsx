var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

function Main() {
    this.getClassName = function() {
        if (this.props.className) {
            return this.props.className + " CCH-DIVIDE-MAIN";
        }
        return "CCH-DIVIDE-MAIN";
    }
    this.render = function() {
        return jade(`
            div(className={this.getClassName()})
                |{this.props.children}
            `);
    }
}

function Side() {
    this.getClassName = function() {
        if (this.props.className) {
            return this.props.className + " CCH-DIVIDE-SIDE";
        }
        return "CCH-DIVIDE-SIDE";
    }
    this.render = function() {
        return jade(`
            div(className={this.getClassName()})
                div(className="CCH-DIVIDE-SIDE-IN")
                    |{this.props.children}
            `);
    }
}

exports.Main = React.createClass(new Main());
exports.Side = React.createClass(new Side());

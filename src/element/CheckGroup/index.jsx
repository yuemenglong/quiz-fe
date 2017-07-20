var React = require("react");
var _ = require("lodash");
var kit = require("/common/kit");
require('./style.less');

function CheckGroupClass() {
    this.getDefaultProps = function() {
        return {
            list: [],
            name: null,
            value: null,
            className: null,
            disabled: false,
            onChange: [],
        }
    }
    this.onClick = function(item, e) {
        var checked = e.target.checked;
        if (!checked) {
            var value = null;
        } else {
            var value = item.value;
        }
        this.setState({ value: value });
        this.onChange(value);
    }
    this.onChange = function(value) {
        var e = { target: { name: this.props.name, value: value } }
        this.props.onChange && this.props.onChange(e);
    }
    this.renderItems = function() {
        return this.props.list.map(function(item) {
            var checked = this.props.value != null && this.props.value == item.value;
            var style = checked ? { color: 'red' } : {};
            return jade(`
            div(className="cch-check-item" key={item.value})
                input(type="checkbox" checked={checked} onChange={this.onClick.bind(null, item)} disabled={this.props.disabled})
                span(style={style}) {item.option}`)
        }.bind(this))
    }
    this.render = function() {
        return jade(`
        div(className={kit.joinClassName(this.props.className, "cch-check-group")})
            |{this.renderItems()}
            `)
    }
}

module.exports = React.createClass(new CheckGroupClass())

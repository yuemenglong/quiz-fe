var React = require("react");
var _ = require("lodash");
var kit = require("/common/kit");
require('./style.less');

function CheckMulti() {
    this.getDefaultProps = function() {
        return {
            list: [],
            name: null,
            value: [],
            className: null,
            disabled: false,
            onChange: [],
        }
    }
    this.componentWillMount = function() {
        if (!Array.isArray(this.props.value)) {
            throw Error("Value Must Be A Array")
        }
    }
    this.onClick = function(item, e) {
        var checked = e.target.checked;
        if (checked) {
            var value = this.props.value.concat([item.value]);
        } else {
            var value = this.props.value.filter(function(v) {
                return v != item.value;
            });
        }
        // console.log(this.state.value, value)
        this.setState({ value: value });
        this.onChange(value);
    }
    this.onChange = function(value) {
        var e = { target: { name: this.props.name, value: value } }
        this.props.onChange && this.props.onChange(e);
    }
    this.renderItems = function() {
        return this.props.list.map(function(item) {
            var checked = this.props.value.indexOf(item.value) >= 0;
            var style = checked ? { color: 'red' } : {};
            return jade(`
            div(className="cch-check-item" key={item.value})
                input(type="checkbox" checked={checked} onChange={this.onClick.bind(null, item)} disabled={this.props.disabled})
                span(style={style}) {item.option}`)
        }.bind(this))
    }
    this.render = function() {
        return jade(`
        div(className={kit.joinClassName(this.props.className, "cch-check-multi")})
            |{this.renderItems()}
            `)
    }
}

module.exports = React.createClass(new CheckMulti())

var React = require("react");

require("./style.less");

//props list[{value, option}] value
function SelectClass() {
    this.getDefaultProps = function() {
        return {
            list: []
        };
    }
    this.onKeyPress = function(e) {
        this.props.onKeyPress && this.props.onKeyPress(e);
    }
    this.onChange = function(e) {
        this.props.onChange && this.props.onChange(e);
    }
    this.onBlur = function(e) {
        this.props.onBlur && this.props.onBlur(e);
    }
    this.onFocus = function(e) {
        this.props.onFocus && this.props.onFocus(e);
    }
    this.render = function() {
        var that = this;
        var className = this.props.className ? "cch-select " + this.props.className : "cch-select";
        var props = {
            className:className,
            name:this.props.name,
            onKeyPress:this.onKeyPress,
            onFocus:this.onFocus,
            onBlur:this.onBlur, onChange:this.onChange,
            value:this.props.value,
            disabled:this.props.disabled,
            key:this.props.key
        };
        return jade("select({...props}) #{}", function() {
            return that.props.list.map(function(o, i) {
                return jade("option(value={o.value} disabled={o.disabled} key={o.value}) {o.option}")
            })
        })
    }
}
var Select = React.createClass(new SelectClass());

module.exports = Select;
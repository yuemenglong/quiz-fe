var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

function renderInput() {
    var text = this.state.input != undefined && !this.state.choseCilck ? this.state.input : _.get(this.state, "selected.option");
    var props = {
        ref: "input",
        type: "text",
        className: this.props.className,
        onFocus: this.onFocusInput,
        placeholder: text,
        onChange: this.onChangeInput,
        onBlur: this.onBlurInput,
        onFocus: this.onFocusInput,
        onKeyPress: this.onKeyPressInput,
        disabled: this.props.disabled,
    }
    if (this.state.choseCilck) {
        props.value = "";
        return jade(`
            div(className="div-select")
                div(className="div-select-text")
                    input({...props})
                div(className="div-select-arrow" onClick={this.onClickArrow})
                    div ▼
            `);
    } else {
        props.value = text;
        return jade(`
            div(className="div-select")
                div(className="div-select-text")
                    input({...props})
                div(className="div-select-arrow" onClick={this.onClickArrow})
                    div ▼
            `);
    }

}

function renderSelect() {
    var className = "div-select-list";
    className += this.state.showSelect ? " show" : " hide";
    var selectedValue = _.get(this.state, "selected.value");
    var that = this;
    return jade(`div(className={className})`, function() {
        return that.getFilteredList().map(function(item, i) {
            var className = "div-select-item";
            className += selectedValue == item.value ? " div-select-selected" : "";
            className += that.state.input != undefined && i == 0 ? " div-select-first" : "";
            return jade(`div(className={className} value={item.value} key={item.value} onMouseDown={that.onMouseDown.bind(null, item)}) {item.option}`);
        });
    });
}

function ChosenClass() {
    this.getDefaultProps = function() {
        var list = [];
        return { list: list, onChange: function() {} };
    }
    this.getFilteredList = function() {
        var that = this;
        return this.props.list.filter(function(item) {
            if (that.state.input == undefined || that.state.choseCilck) {
                return true;
            }
            return item.option.toString().indexOf(that.state.input) >= 0 ||
                item.option.toString().toLowerCase().indexOf(that.state.input) >= 0;
        })
    }
    this.componentWillReceiveProps = function(props) {
        if (_.isEqual(props.value, this.props.value) && _.isEqual(props.list, this.props.list)) {
            return;
        }
        this.setState(this.getStateByProps(props));
    }
    this.getStateByProps = function(props) {
        var value = props.value == undefined ? _.get(props.list[0], "value") : props.value;
        var selected = props.list.filter(function(item) {
            return item.value == value;
        })[0];
        return { showSelect: false, input: undefined, selected: selected, choseCilck: false };
    }
    this.getInitialState = function() {
        return this.getStateByProps(this.props);
    }
    this.onFocusInput = function(e) {
        this.setState({ showSelect: true, choseCilck: true });
    }

    this.onChangeInput = function(e) {
        this.setState({ input: e.target.value, choseCilck: false });
    }

    this.onClickArrow = function() {
        this.refs.input.focus();
    }
    this.onKeyPressInput = function(e) {
        if (e.key == "Enter") {
            var item = this.getFilteredList()[0];
            if (item) {
                this.setState({ selected: item, input: undefined, choseCilck: false });
                this.props.onChange({ target: { name: this.props.name, value: item.value } });
            }
            this.refs.input.blur();
        }
    }
    this.onBlurInput = function() {
        this.setState({ showSelect: false, input: undefined, choseCilck: false });
    }
    this.onMouseDown = function(item) {
        this.setState({ selected: item, input: undefined, choseCilck: false });
        this.props.onChange({ target: { name: this.props.name, value: item.value } });
    }
    this.renderInput = renderInput;
    this.renderSelect = renderSelect;
    this.render = function() {
        return jade(`
            div(className="cch-chosen")
                |{this.renderInput()}
                |{this.renderSelect()}
            `);
    }
}

var Chosen = React.createClass(new ChosenClass());
module.exports = Chosen;

var React = require("react");
var _ = require("lodash");
require('./style.less');

function SelectorClass() {
    this.getDefaultProps = function() {
        return {
            items: [],
            renderItem: null,
            renderFooter: null,
            disabled: false,
        };
    }
    this.componentWillMount = function() {
        if (typeof this.props.renderItem != "function") {
            throw new Error("Selector Must Have RenderItem Function");
        }
    }
    this.onChangeChecked = function(idx, e) {
        var items = this.props.items.map(function(item, i) {
            return i == idx ? _.defaults({ _checked: e.target.checked }, item) : item;
        })
        this.props.onChange && this.props.onChange(items);
    }
    this.renderItem = function(item, idx) {
        var onChange = this.onChangeChecked.bind(null, idx);
        return jade(`
        div(key={item._key || idx})
            input(type="checkbox" checked={item._checked} onChange={onChange} disabled={this.props.disabled})
            div(className='inline-block')
                |{this.props.renderItem(item, idx)}
            `)
    }
    this.renderItems = function() {
        return this.props.items.map(this.renderItem);
    }
    this.onChangeAll = function(e) {
        var checked = e.target.checked;
        var items = this.props.items.map(function(item) {
            return _.defaults({ _checked: checked }, item);
        })
        this.props.onChange && this.props.onChange(items);
    }
    this.renderTotal = function() {
        var selectAll = this.props.items.every(function(item) {
            return item._checked;
        })
        return jade(`
        div
            span 全选
            input(type="checkbox" checked={selectAll} onChange={this.onChangeAll} disabled={this.props.disabled})
            div(className='inline-block')
                |{this.renderFooter()}
            `)
    }
    this.renderFooter = function() {
        return this.props.renderFooter && this.props.renderFooter(this.props.items);
    }
    this.render = function() {
        return jade(`
        div(className='seletor')
            |{this.renderItems()}
            |{this.renderTotal()}
            `)
    }
}
module.exports = React.createClass(new SelectorClass());

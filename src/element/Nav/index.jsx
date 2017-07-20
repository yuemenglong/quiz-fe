var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");
var kit = require("/common/kit");

require("./style.less");

// header[], body[], className, onChange(i, header), delete create() onChangeItem(header, body)
function NavClass() {
    this.getDefaultProps = function() {
        return { header: [], body: [], className: "", active: null, init: 0 };
    }
    this.getInitialState = function() {
        return { active: this.props.init };
    }
    this.componentWillReceiveProps = function(props) {
        if (!_.isEqual(this.state.active, props.init)) this.setState({ active: props.init });
    }
    this.onChange = function(i, header, body, e) {
        this.setState({ active: i });
        this.props.onChange && this.props.onChange(i);
    }
    this.onDelete = function(i, header, body, e) {
        if (!this.props.onDelete) {
            return;
        }
        var activeHeader = this.props.header[this.state.active];
        var newHeader = this.props.header.filter(function(h, idx) {
            return i != idx;
        })
        var newBody = this.props.body.filter(function(b, idx) {
            return i != idx;
        })
        if (i == this.state.active) {
            var active = Math.min(this.state.active, newHeader.length - 1);
        } else {
            var active = newHeader.indexOf(activeHeader);
        }
        var nextActive = active;
        var ret = this.props.onDelete(i, this.state.active);
        active = ret == undefined ? active : ret;
        this.setState({ active: active });
        e.stopPropagation();
    }
    this.onCreate = function() {
        if (!this.props.onCreate) {
            return;
        }
        var active = this.state.active;
        var nextActive = this.props.header.length;
        var ret = this.props.onCreate(nextActive, this.state.active);
        var active = ret || this.props.header.length;
        this.setState({ active: active });
    }
    this.renderHeader = function(active) {
        var createIcon = this.props.onCreate && jade(`
            li(key="CREATE")
                a(className="nav-create" href="javascript:void(0);" onClick={this.onCreate})
                    b(className="") +`);
        return this.props.header.map(function(item, i) {
            var className = active == i ? "active" : "";
            var onChange = this.onChange.bind(null, i, this.props.header[i], this.props.body[i]);
            var onDelete = this.onDelete.bind(null, i, this.props.header[i], this.props.body[i]);
            var deleteIcon = this.props.onDelete && jade(`
                b(className="nav-delete" onClick={onDelete}) ×`);
            return jade(`
                li(className={className} key={item})
                    a(href="javascript:void(0);" onClick={onChange}) {item}{deleteIcon}
                `)
        }.bind(this)).concat([createIcon]);
    }
    this.renderBody = function(active) {
        var body = this.props.body ? this.props.body[active] : null;
        if (this.props.renderBody) {
            return this.props.renderBody(body, active);
        }
        if (body) {
            return body;
        }
        return;
    }
    this.render = function() {
        var active = this.state.active < this.props.header.length ? this.state.active : this.props.header.length - 1;
        //props的active拥有更高优先级
        var active = this.props.active != null ? this.props.active : active;
        var className = "cch-nav " + this.props.className;
        return jade(`
            div(className={className})
                ul(className='nav nav-tabs') {this.renderHeader(active)}
                div(className="nav-body") {this.renderBody(active)}
            `);
    }
}

module.exports = React.createClass(new NavClass());

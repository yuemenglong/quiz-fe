var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("lodash");

require("./style.less");

//{header[], body[[],[]], }
function TableClass() {
    this.getItem = function(i, j) {
        var row = this.props.body[i];
        if (row.constructor == Tr) {
            row = row.tds;
        }
        var item = row[j];
        if (item.constructor == Td) {
            item = item.td;
        }
        return item;
    }
    this.getRowLength = function(i) {
        var row = this.props.body[i];
        if (row.constructor == Tr) {
            row = row.tds;
        }
        return row.length;
    }
    this.getColPrev = function(i, j) {
        if (i == 0) return;
        // return this.props.body[i - 1][j];
        return this.getItem(i - 1, j);
    }
    this.getRowPrev = function(i, j) {
        if (j == 0) return;
        // return this.props.body[i][j - 1];
        return this.getItem(i, j - 1);
    }
    this.getColNext = function(i, j) {
        if (i == this.props.body.length - 1) return;
        // return this.props.body[i + 1][j];
        return this.getItem(i + 1, j);
    }
    this.getRowNext = function(i, j) {
        // if (j == this.props.body[i].length - 1) return;
        if (j == this.getRowLength(i) - 1) return;
        // return this.props.body[i][j + 1];
        return this.getItem(i, j + 1);
    }
    this.getColSpan = function(i, j) {
        // var item = this.props.body[i][j];
        var item = this.getItem(i, j);
        var colspan = 1;
        // for (var k = j + 1; k < this.props.body[i].length; k++) {
        // if (item == this.props.body[i][k]) {
        for (var k = j + 1; k < this.getRowLength(i); k++) {
            if (item == this.getItem(i, k)) {
                colspan++;
            } else {
                break;
            }
        }
        return colspan;
    }
    this.getRowSpan = function(i, j) {
        // var item = this.props.body[i][j];
        var item = this.getItem(i, j);
        var rowspan = 1;
        for (var k = i + 1; k < this.props.body.length; k++) {
            // if (item == this.props.body[k][j]) {
            if (item == this.getItem(k, j)) {
                rowspan++;
            } else {
                break;
            }
        }
        return rowspan;
    }
    this.renderHeader = function() {
        if (!this.props.header) return;
        return jade("tr", function() {
            return this.props.header.map(function(item, i) {
                return jade("td(key={i}) {item}");
            })
        }.bind(this))

    }
    this.needColspan = function(i) {
        var colSpan = this.props.colspan || this.props.colSpan;
        if (!colSpan) {
            return false;
        }
        if (_.isArray(colSpan)) {
            return colSpan.indexOf(i) >= 0;
        } else if (_.isRegExp(colSpan)) {
            return colSpan.test(i);
        } else {
            throw new Error("Invalid Colspan: " + colSpan);
        }
    }
    this.needRowspan = function(i) {
        var rowSpan = this.props.rowspan || this.props.rowSpan;
        if (!rowSpan) {
            return false;
        }
        if (_.isArray(rowSpan)) {
            return rowSpan.indexOf(i) >= 0;
        } else if (_.isRegExp(rowSpan)) {
            return rowSpan.test(i);
        } else {
            throw new Error("Invalid Rowspan: " + rowSpan);
        }
    }
    this.renderBody = function() {
        if (!this.props.body) return;
        return this.props.body.map(function(row, i) {
            var key = i;
            if (_.get(row, "constructor") == Tr) {
                var className = row.opt.className;
                var style = row.opt.style;
                key = row.opt.key || key;
                row = row.tds;
            }
            return jade("tr(key={key} className={className} style={style})", function() {
                return row.map(function(item, j) {
                    var key = j;
                    var colspan = 1;
                    var rowspan = 1;
                    if (_.get(item, "constructor") == Td) {
                        var opt = item.opt;
                        opt.className && (props.className = opt.className);
                        opt.style && (props.style = opt.style);
                        opt.key && (key = opt.key);
                        item = item.td;
                    }
                    // if (this.props.colspan && this.props.colspan.indexOf(i) >= 0) {
                    if (this.needColspan(i)) {
                        if (item == this.getRowPrev(i, j)) {
                            return;
                        }
                        colspan = this.getColSpan(i, j);
                    }
                    // if (this.props.rowspan && this.props.rowspan.indexOf(j) >= 0) {
                    if (this.needRowspan(j)) {
                        if (item == this.getColPrev(i, j)) {
                            return;
                        }
                        rowspan = this.getRowSpan(i, j);
                    }
                    var props = {};
                    if (colspan > 1) props.colSpan = colspan;
                    if (rowspan > 1) props.rowSpan = rowspan;
                    return jade("td(key={key} {...props}) {item}");
                }.bind(this)).filter(function(item) {
                    return item !== undefined;
                })
            }.bind(this))
        }.bind(this))
    }
    this.renderFoot = function() {
        if (!this.props.foot) return;
        return jade(`tfoot {this.props.children}`)
    }
    this.render = function() {
        var thead = this.props.header && jade("thead {this.renderHeader()}");
        var tbody = this.props.body && jade("tbody {this.renderBody()}");
        var className = "table cch-table " + this.props.className;
        return jade(`
            table(className={className} style={this.props.style})
                |{thead}
                |{tbody}
                |{this.renderFoot()}
            `);
    }
}

// opt:{className:"", key:"", style:""}
function Tr(tds, opt) {
    this.tds = tds;
    this.opt = opt || {};
}

// opt:{className:"", key:"", style:""}
function Td(td, opt) {
    this.td = td;
    this.opt = opt || {};
}

function tr(tds, opt) {
    return new Tr(tds, opt);
}

function td(td, opt) {
    return new Td(td, opt);
}

module.exports = React.createClass(new TableClass());
module.exports.tr = tr;
module.exports.td = td;

var React = require('react');
var ReactDOM = require("react-dom");
var _ = require('lodash');
var kit = require("/common/kit");
require('./style.less');
var PDF = require('./imgs/pdf.png');
var WORD = require('./imgs/word.png');
var COMMON = require('./imgs/common.png');

function UploadClass() {
    this.getDefaultProps = function() {
        return {
            url: '/upload',
            baseUrl: '/static/files/',
            file: { fileId: null, fileName: null },
            caption: '',
            delBtn: true,
            disabled: false
        }
    }
    this.componentWillMount = function() {
        if ((!this.props.file.fileId || !this.props.file.fileName) &&
            typeof this.props.onChange != "function") {
            throw new Error("Must Has OnChange Callback");
        }
    }
    this.onChangeAttach = function() {
        var input = ReactDOM.findDOMNode(this.refs.file);
        var formData = new FormData();
        if (!input.files.length) return;
        formData.append('file', input.files[0]);
        var that = this;
        var changeUrl = this.props.url || '/upload';
        kit.ajax({
            url: changeUrl,
            data: formData,
            type: 'POST',
            cache: false,
            processData: false,
            contentType: false,
            success: function(res) {
                var fileId = res;
                var fileName = input.files[0].name;
                var file = { fileId: fileId, fileName: fileName };
                that.props.onChange(file);
            }
        })
    }
    this.onDelete = function() {
        this.props.onDelete && this.props.onDelete(this.props.file);
    };
    this.renderEdit = function() {
        return jade(`
        div(className='product-upload')
            span {this.props.caption}
            button(type='button' className='upload-btn' title={this.props.title})
                input(key={Math.random()} type='file' ref='file' onChange={this.onChangeAttach} accept="image/gif,image/jpeg,image/jpg,image/png,image/bmp,application/mscation,application/pdf" disabled={this.props.disabled})
            `)
    }
    this.renderShow = function() {
        var fileName = this.props.file.fileName;
        var fileId = this.props.file.fileId;
        var url = this.props.baseUrl + fileId;
        if (/\.docx?$/.test(fileName)) {
            var imgUrl = WORD;
        } else if (/\.pdf$/.test(fileName)) {
            var imgUrl = PDF;
        } else if (/(\.jpg$|\.jpeg$|\.png$|\.bmp$|\.gif)/.test(fileName)) {
            var imgUrl = url;
        } else {
            var imgUrl = COMMON;
        }
        var display = this.props.delBtn ? 'block' : 'none';
        return jade(`
        div(className='product-imgs')
            a(href={url} target="_blank" title='点击查看大图')
                img(title={fileName} src={imgUrl})
            button(type='button'style={{display:display}} onClick={this.onDelete} className='btn btn-danger del-btn-attach') ×
        `);
    }
    this.render = function() {
        if (this.props.file.fileId && this.props.file.fileName) {
            return this.renderShow();
        } else {
            return this.renderEdit();
        }
    }
}

module.exports = React.createClass(new UploadClass());

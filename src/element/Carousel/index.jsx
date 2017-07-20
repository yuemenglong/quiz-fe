var React = require("react");
var _ = require("lodash");
require("./style.less");
var ev = require("yy-fe/ev");
var Img = require("/element/Img")
/*  --- Carousel Component ---
    1. props传入：imgs数组(length=6)
*/

function CarouselClass() {
    this.getDefaultProps = function() {
        return {
            ev: ev,
            imgs: [],
        };
    }
    this.componentDidMount = function() {
        var len = this.props.imgs.length;
        var loop = len == 0 ? null : setInterval(function() {
            this.onClickNext();
        }.bind(this), 3000);
        this.setState({ imgsNum: len, loop: loop });
    }
    this.getInitialState = function() {
        return {
            imgsNum: 0,
            imgIdx: 0, // idx in (props.imgs)
            loop: null,
            curImgs: this.getCurImgs(), // 0~4
        };
    }
    this.clearLoop = function() {
        clearInterval(this.state.loop);
        var newLoop = setInterval(function() {
            this.onClickNext();
        }.bind(this), 3000);
        this.setState({ loop: newLoop });
    }
    this.getCurImgs = function() { // initial curImgs stack
        var imgs = this.props.imgs;
        var curImgs = imgs.length > 5 ? imgs.slice(0, 5) : imgs;
        curImgs = curImgs.map(function(cItem, i) {
            return { "origIdx": i, "url": cItem };
        })
        return curImgs;
    }
    this.updateCurImgs = function(operate) { // operate == "prev"/"next"
        var curIdx = this.state.imgIdx;
        var curImgs = _.clone(this.state.curImgs); // length <= 5
        var length = curImgs.length;
        if (curIdx == _.get(curImgs[length - 1], "origIdx") && operate == "next") {
            // 右移
            var nextIdx = curIdx + 1;
            nextIdx == this.state.imgsNum && (nextIdx = 0);
            var nextImg = this.props.imgs[nextIdx];
            curImgs.push({ "origIdx": nextIdx, "url": nextImg });
            curImgs.shift();
        } else if (curIdx == _.get(curImgs[0], "origIdx") && operate == "prev") {
            // 左移
            var prevIdx = curIdx - 1;
            prevIdx == -1 && (prevIdx = this.state.imgsNum - 1);
            var prevImg = this.props.imgs[prevIdx];
            curImgs.unshift({ "origIdx": prevIdx, "url": prevImg });
            curImgs.pop();
        }
        this.setState({ curImgs: curImgs });
    }
    this.onClickPrev = function(e) {
        var idx = this.state.imgIdx - 1;
        idx == -1 && (idx = this.state.imgsNum - 1);
        this.setState({ imgIdx: idx });
        this.clearLoop();
        this.updateCurImgs("prev");
    }
    this.onClickNext = function(e) {
        var idx = this.state.imgIdx + 1;
        idx == this.state.imgsNum && (idx = 0);
        this.setState({ imgIdx: idx });
        this.clearLoop();
        this.updateCurImgs("next");
    }
    this.onClickNav = function(idx, e) {
        this.setState({ imgIdx: idx });
        this.clearLoop();
    }
    this.renderFooter = function() {
        var thumbImgs = this.state.curImgs;
        var imgsLi = thumbImgs.map(function(imgItem, i) {
            var origIdx = imgItem.origIdx;
            var className = origIdx == this.state.imgIdx ? "list-item active" : "list-item";
            return jade(`
            li(key={i})
                div(className={className} onClick={this.onClickNav.bind(null, origIdx)})
                    Img(src={imgItem.url})
            `);
        }.bind(this))
        return jade(`
        div(className="carousel-footer")
            ul(className="m-list")
                li(className="prev" onClick={this.onClickPrev}) &lt;
                |{imgsLi}
                li(className="next" onClick={this.onClickNext}) &gt;
        `);
    }
    this.renderImgContainer = function() {
        var imgUrl = this.props.imgs[this.state.imgIdx] || "";
        return jade(`
        div(className="m-slider")
            div(className="slide")
                Img(src={imgUrl} alt="该图片暂时无法查看")
        `);
    }
    this.render = function() {
        return jade(`
        div(id="cch-carousel")
            |{this.renderImgContainer()}
            |{this.renderFooter()}
        `);
    }
}

module.exports = React.createClass(new CarouselClass());

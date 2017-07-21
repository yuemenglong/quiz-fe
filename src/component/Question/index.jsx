var _ = require("lodash");
var ev = require("yy-fe/ev");
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;

function QuestionClass() {
    this.getDefaultProps = function() {
        return { question: null, idx: null }
    }
    this.getInitialState = function() {
        var that = this;
        return { answers: _.get(this.props.question, "answser", []) }
    }
    this.renderTitle = function() {
        var type = this.props.question.info.multi ? "多选题" : "单选题"
        return [
            jade(`h1(key="type") {this.props.idx}.{type}`),
            jade(`h1(key="title") {this.props.question.info.title}`),
        ]
    }
    this.submitAnswer = function(answer) {
        this.props.onSubmit && this.props.onSubmit(answer)
    }
    this.onChoose = function(answer) {
        if (!this.props.question.info.multi) {
            this.submitAnswer(answer)
        } else {
            if (this.props.answers.indexOf(answer) >= 0) {
                var answers = this.props.answers.filter(function(c) {
                    return c != answer
                })
            } else {
                var answers = this.props.answers.concat([answer]).sort()
            }
            this.setState({ answers: answers })
        }
    }
    this.renderChoose = function() {
        return ["a", "b", "c", "d"].map(function(no) {
            var choose = this.props.question.info[no]
            return jade(`
            div(key={no}) 
                span {no.toUpperCase()}
                button(onClick={this.onChoose.bind(null, no)}) {choose}`)
        }.bind(this))
    }
    this.onClickSubmit = function() {
        this.submitAnswer(answer)
    }
    this.renderMultiInfo = function() {
        if (!this.props.question.info.multi) {
            return
        }
        return [
            jade(`button(key="submit" onClick={this.onClickSubmit}) 确定`),
        ]
    }
    this.renderAnswer = function() {
        return jade(`h4(key="answer") 你的选择：{this.props.answers}`)
    }
    this.renderQuestion = function() {
        if (!this.props.question) {
            return
        }
        return [
            this.renderTitle(),
            this.renderChoose(),
            this.renderAnswer(),
            this.renderMultiInfo()
        ]
    }
    this.render = function() {
        return jade(`
        div
            |{this.renderQuestion()}
        `)
    }
}

module.exports = React.createClass(new QuestionClass())
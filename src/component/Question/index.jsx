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
require("./style.less")

function QuestionClass() {
    this.getDefaultProps = function() {
        return { question: null, type: "normal" }
    }
    this.getInitialState = function() {
        return { answers: _.get(this.props.question, "answer", "").split("") }
    }
    this.renderTitle = function() {
        var type = this.props.question.info.multi ? "多选题" : "单选题"
        return [
            jade(`h1(key="type") {this.props.question._idx}.{type}`),
            jade(`h1(key="title") {this.props.question.info.title}`),
        ]
    }
    this.submitAnswer = function(answer) {
        this.setState({ answers: [] })
        this.props.onSubmit && this.props.onSubmit(answer)
    }
    this.onChoose = function(answer) {
        if (!this.isNormal()) {
            return
        }
        if (!this.isMulti()) {
            this.submitAnswer(answer)
        } else {
            if (this.state.answers.indexOf(answer) >= 0) {
                var answers = this.state.answers.filter(function(c) {
                    return c != answer
                })
            } else {
                var answers = this.state.answers.concat([answer]).sort()
            }
            this.setState({ answers: answers })
        }
    }
    this.isReview = function() {
        return this.props.type == "review"
    }
    this.isNormal = function() {
        return this.props.type == "normal"
    }
    this.isMulti = function() {
        return this.props.question.info.multi
    }
    this.renderChoose = function() {
        function choosePoint(no) {
            if (this.isNormal()) {
                var userAnswer = this.state.answers.join("")
            } else if (this.isReview()) {
                var userAnswer = _.get(this.props.question, "answer", "")
            }
            if (userAnswer.indexOf(no) >= 0) {
                return jade(`span(className="choose-point")`)
            }
        }

        var normals = ["a", "b", "c", "d"].map(function(no) {
            var choose = this.props.question.info[no]
            if (this.isReview() && this.props.question.info.answer.indexOf(no) >= 0) {
                var className = "btn btn-success"
            } else if (this.isReview()) {
                var className = "btn btn-default disabled"
            } else {
                var className = "btn btn-default"
            }
            return jade(`
            div(className="choose" key={this.props.question.id + no})
                span {no.toUpperCase()}
                button(className={className} onClick={this.onChoose.bind(null, no)}) {choose}
                |{choosePoint.call(this, no)}`)
        }.bind(this))
        var skip = jade(`
            div(className="choose" key={this.props.question.id +"skip"})
                span
                button(className="btn btn-default" onClick={this.onChoose.bind(null, "")}) 跳过`)
        if (!this.props.question.info.multi && this.props.type == "normal") {
            return normals.concat([skip])
        } else {
            return normals
        }
    }
    this.onClickSubmit = function() {
        this.submitAnswer(this.state.answers.join(""))
    }
    this.renderMultiSubmit = function() {
        if (!this.props.question.info.multi || this.props.type != "normal") {
            return
        }
        return [
            jade(`button(className="btn btn-primary" key="submit" onClick={this.onClickSubmit}) 确定`),
        ]
    }
    this.renderQuestion = function() {
        if (!this.props.question) {
            return
        }
        return [
            this.renderTitle(),
            this.renderChoose(),
            this.renderMultiSubmit()
        ]
    }
    this.render = function() {
        console.log(this.state, this.props)
        return jade(`
        div
            |{this.renderQuestion()}
        `)
    }
}

module.exports = React.createClass(new QuestionClass())
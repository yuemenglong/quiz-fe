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
var kit = require("/common/kit");

function AppClass() {
    this.fetch = ev.createFetch();
    this.getInitialState = function() {
        var that = this;
        return {
            quiz: that.fetch("quiz", "/quiz", function(res) {
                that.fetch("question", `/quiz/${res.id}/question`)
            }) || {},
            question: null,
            answers: [],
            finished: false,
        }
    }
    this.renderTitle = function() {
        var idx = this.state.quiz.questions.length + 1;
        var type = this.state.question.info.multi ? "多选题" : "单选题"
        return [
            jade(`h1(key="type") {idx}.{type}`),
            jade(`h1(key="title") {this.state.question.info.title}`),
        ]
    }
    this.submitAnswer = function(answer) {
        kit.ajax({
            url: `/quiz/${this.state.quiz.id}/question/${this.state.question.id}`,
            type: "POST",
            data: JSON.stringify({ answer: answer }),
            success: function(res) {
                this.setState({ question: res, answers: [] })
                if (res == null) {
                    this.setState({ finished: true })
                }
            }.bind(this)
        })
    }
    this.onChoose = function(answer) {
        if (!this.state.question.info.multi) {
            var question = _.defaults({ answer: answer }, this.state.question)
            question.correct = question.answer == question.info.answer
            var quiz = _.clone(this.state.quiz)
            quiz.questions.push(question)
            this.setState({ quiz: quiz, question: null })
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
    this.renderChoose = function() {
        return ["a", "b", "c", "d"].map(function(no) {
            var choose = this.state.question.info[no]
            return jade(`
            div(key={no}) 
                span {no.toUpperCase()}
                button(onClick={this.onChoose.bind(null, no)}) {choose}`)
        }.bind(this))
    }
    this.onClickSubmit = function() {
        var answer = this.state.answers.join("")
        var question = _.defaults({ answer: answer }, this.state.question)
        question.correct = question.answer == question.info.answer
        var quiz = _.clone(this.state.quiz)
        quiz.questions.push(question)
        this.setState({ quiz: quiz, question: null })
        this.submitAnswer(answer)
    }
    this.renderMultiInfo = function() {
        if (!this.state.question.info.multi) {
            return
        }
        return [
            jade(`h4(key="answer") 已选择：{this.state.answers}`),
            jade(`button(key="submit" onClick={this.onClickSubmit}) 确定`),
        ]
    }
    this.renderQuestion = function() {
        if (!this.state.question) {
            return
        }
        return [
            this.renderTitle(),
            this.renderChoose(),
            this.renderMultiInfo()
        ]
    }
    this.renderResult = function() {
        if (!this.state.finished) {
            return
        }
        var succ = this.state.quiz.questions.filter(function(q) {
            return q.correct == true
        }).length
        var fail = this.state.quiz.questions.filter(function(q) {
            return q.correct == false
        }).length
        return jade(`h5 正确{succ}，错误{fail}`)
    }
    this.render = function() {
        console.log(this.state)
        return jade(`
        div
            |{this.renderQuestion()}
            |{this.renderResult()}
        `)
    }
}
module.exports = React.createClass(new AppClass());
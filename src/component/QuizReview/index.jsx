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
var Index = require("/component/Index");
var Quiz = require("/component/Quiz");
var Question = require("/component/Question");
require("./style.less")

function QuizReview() {
    this.fetch = ev.createFetch();
    this.getInitialState = function() {
        console.log(this.props);
        var quizId = this.props.location.pathname.split("/").slice(-2)[0]
        return {
            quiz: this.fetch("quiz", `/quiz/${quizId}`, this.fetchNext) || null,
            quizId: quizId,
            questionId: 0,
            question: null,
            reAnswer: false,
        }
    }
    this.renderCheckReAnswer = function() {

    }
    this.fetchNext = function() {
        var question = _.find(this.state.quiz.questions, function(q) {
            return q.id > this.state.questionId && q.correct == false
        }.bind(this))
        if (!question) {
            return this.setState({ question: null, reAnswer: true })
        }
        if (question.info) {
            this.setState({ question: question, questionId: question.id })
            return;
        }
        kit.ajax({
            url: `/question/${question.infoId}`,
            success: function(info) {
                var quiz = _.clone(this.state.quiz);
                var newQuestion = _.defaults({ info: info }, question)
                quiz.questions = kit.replaceBy(quiz.questions, newQuestion, "id")
                this.setState({ quiz: quiz, question: newQuestion, questionId: newQuestion.id })
            }.bind(this)
        })
    }
    this.reAnswer = function() {
        browserHistory.push(`/quiz/${this.state.quizId}?reanswer=1`)
    }
    this.renderReAnswer = function() {
        if (!this.state.reAnswer) {
            return;
        }
        return jade(`button(className="btn btn-primary" onClick={this.reAnswer}) 重新答错误题目`)
    }
    this.renderQuestion = function() {
        if (!this.state.quiz || !this.state.question) {
            return jade(`div`)
        }
        return jade(`
        div(className="review-op")
            Question(question={this.state.question} type="review")
            button(className="btn btn-primary" onClick={this.fetchNext}) 下一题
        `)
    }
    this.render = function() {
        console.log(this.state)
        return jade(`
        div
            |{this.renderQuestion()}
            |{this.renderReAnswer()}
        `)
    }
}

module.exports = React.createClass(new QuizReview())
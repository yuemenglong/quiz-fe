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

function QuizResultClass() {
    this.fetch = ev.createFetch();
    this.getInitialState = function() {
        var quizId = this.props.location.pathname.split("/").slice(-2)[0]
        return { quiz: this.fetch("quiz", `/quiz/${quizId}`) || null, quizId: quizId }
    }
    this.gotoReview = function() {
        browserHistory.push(`/quiz/${this.state.quizId}/review`)
    }
    this.gotoNextQuiz = function() {
        ev.clearFetch("quiz")
        browserHistory.push(`/`)
    }
    this.renderButton = function(fail) {
        if (fail) {
            return jade(`button(onClick={this.gotoReview}) 查看错误题目`)
        } else {
            return jade(`button(onClick={this.gotoNextQuiz}) 下一次考试`)
        }
    }
    this.renderResult = function() {
        if (!this.state.quiz.finished) {
            return
        }
        var succ = this.state.quiz.questions.filter(function(q) {
            return q.correct == true
        }).length
        var fail = this.state.quiz.questions.filter(function(q) {
            return q.correct == false
        }).length
        return jade(`
        div
            h5 正确{succ}，错误{fail}
            button(onClick={this.onClick}) 查看错误题目
            `)
    }
    this.render = function() {
        console.log(this.state)
        if (!this.state.quiz || !this.state.quiz.finished) {
            return jade(`div`)
        }
        var succ = this.state.quiz.questions.filter(function(q) {
            return q.correct == true
        }).length
        var fail = this.state.quiz.questions.filter(function(q) {
            return q.correct == false
        }).length
        return jade(`
        div
            h5 正确{succ}，错误{fail}
            |{this.renderButton(fail)}
        `)
    }
}

module.exports = React.createClass(new QuizResultClass())
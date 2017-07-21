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

function QuizReview() {
    this.fetch = ev.createFetch();
    this.getInitialState = function() {
        var quizId = this.props.location.pathname.split("/").slice(-2)[0]
        return {
            quiz: this.fetch("quiz", `/quiz/${quizId}`, this.fetchQuestion) || null,
            questionId: 0,
            question: null,
        }
    }
    this.fetchQuestion = function() {
        var question = _.find(this.state.quiz.questions, function(q) {
            return q.id > this.state.questionId && q.correct == false
        }.bind(this))
        if (question.info) {
            this.setState({ question: question, questionId: question.id })
            return;
        }
        kit.ajax({
            url: `/question/${question.infoId}`,
            success: function(info) {
                var quiz = _.clone(this.state.quiz);
                var question = _.defaults({ info: info }, question)
                quiz.questions = kit.replaceBy(quiz.questions, question, "id")
                this.setState({ quiz: quiz, question: question, questionId: question.id })
            }.bind(this)
        })
    }
    this.renderQuestion = function() {
        if (!this.state.question) {
            return jade("div")
        }
        return jade(`Question(question={this.state.question})`)
    }
    this.render = function() {
        console.log(this.state)
        if (!this.state.quiz) {
            return jade(`div`)
        }
        return jade(`
        div
            |{this.renderQuestion()}
        `)
    }
}

module.exports = React.createClass(new QuizReview())
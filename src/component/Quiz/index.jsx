var React = require("react");
var _ = require("lodash");
var ReactRouter = require("react-router")
var browserHistory = ReactRouter.browserHistory
var ev = require("yy-fe/ev");
var Question = require("/component/Question")
var kit = require("/common/kit")

function QuizClass() {
    this.fetch = ev.createFetch();
    this.fetchNextQuestion = function() {
        var question = _.find(this.state.quiz.questions, function(q) {
            return q.answer == null
        })
        var idx = _.indexOf(this.state.quiz.questions, question)
        var quizId = this.state.quizId;
        if (question == null) {
            var quiz = _.defaults({ finished: true }, this.state.quiz)
            ev.updateFetch("quiz", quiz)
            kit.ajax({
                url:`/quiz/${quizId}`,
                type:"PUT",
                data:JSON.stringify({finished:true}),
                success:function(){
                    browserHistory.push(`/quiz/${quizId}/result`)
                }
            })
            return null
        }
        kit.ajax({
            url: `/question/${question.infoId}`,
            type: "GET",
            success: function(info) {
                question = _.defaults({ info: info }, question)
                var quiz = _.clone(this.state.quiz)
                quiz.questions = kit.replaceBy(quiz.questions, question, "id")
                this.setState({ quiz: quiz, question: question, idx: idx })
            }.bind(this)
        })
        return question
    }
    this.getInitialState = function() {
        var quizId = this.props.location.pathname.split("/").slice(-1)[0]
        return {
            quizId: quizId,
            quiz: this.fetch("quiz", `/quiz/${quizId}`, this.fetchNextQuestion) || {},
            question: null,
            idx: null,
        }
    }
    this.onAnswer = function(answer) {
        kit.ajax({
            url: `/quiz/${this.state.quizId}/question/${this.state.question.id}`,
            type: "PUT",
            data: JSON.stringify({ answer: answer }),
            success: function(question) {
                var quiz = _.clone(this.state.quiz)
                quiz.questions = kit.defaultsBy(quiz.questions, question, "id")
                this.setState({ quiz: quiz })
                this.fetchNextQuestion()
            }.bind(this)
        })
    }
    this.renderQuestion = function() {
        var props = {
            question: this.state.question,
            idx: this.state.idx,
            onSubmit: this.onAnswer,
        }
        return jade(`Question({...props})`)
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

module.exports = React.createClass(new QuizClass())
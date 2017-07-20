var ev = require("yy-fe/ev");
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;

function AppClass() {
    this.fetch = ev.createFetch();
    this.getInitialState = function() {
        var that = this;
        return {
            quiz: that.fetch("quiz", "/quiz", function(res) {
                that.fetch("question", `/quiz/${res.id}/question`)
            }) || {},
            question: {},
        }
    }
    this.renderTitle = function(){
        return jade(`h1 `)
    }
    this.renderQuestion = function(){
        if(!this.state.question.id){
            return
        }
        [this.renderTitle(), this.renderChoose()]
        ["a", "b", "c","d"].map(function(no){

        })
    }
    this.render = function() {
        console.log(this.state)
        return jade(`
        div
            |{this.renderQuestion()}
        `)
    }
}
module.exports = React.createClass(new AppClass());
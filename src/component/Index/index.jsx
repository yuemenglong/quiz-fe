var React = require("react");
var _ = require("lodash");
var ReactRouter = require("react-router")
var browserHistory = ReactRouter.browserHistory
var kit = require("/common/kit")
var ev = require("yy-fe/ev")

function IndexClass() {
    this.fetch = ev.createFetch()
    this.componentDidMount = function() {
        this.fetch("quiz", "/quiz", function(quiz) {
            browserHistory.push(`/quiz/${quiz.id}`)
        })
    }
    this.componentWillUnmount = function() {
        ev.clearFetch("quiz")
    }
    this.render = function() {
        return jade(`div`)
    }
}

module.exports = React.createClass(new IndexClass())
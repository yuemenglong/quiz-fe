var React = require("react");
var _ = require("lodash");
var ReactRouter = require("react-router")
var browserHistory = ReactRouter.browserHistory
var kit = require("/common/kit")
var ev = require("yy-fe/ev")

function IndexClass() {
    this.fetch = ev.createFetch()
    this.componentDidMount = function() {
        kit.ajax({
            url: `/quiz`,
            success: function(quiz) {
                if (quiz) {
                    return browserHistory.push(`/quiz/${quiz.id}`)
                }
                kit.ajax({
                    url: "/quiz",
                    type: "POST",
                    success: function(quiz) {
                        return browserHistory.push(`/quiz/${quiz.id}`)
                    }
                })
            }
        })
    }
    this.render = function() {
        return jade(`div`)
    }
}

module.exports = React.createClass(new IndexClass())
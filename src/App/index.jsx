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
var QuizResult = require("/component/QuizResult");
var QuizReview= require("/component/QuizReview");

require("bootstrap")

function AppClass(){
    this.render = function(){
    	return jade(`div(className="container") {this.props.children}`)
    }
}


var App = React.createClass(new AppClass());

module.exports = jade(`
Router(history={browserHistory})
    Route(path="/" component={App})
        IndexRoute(component={Index})
        Route(path="quiz/:id" component={Quiz})
        Route(path="quiz/:id/result" component={QuizResult})
        Route(path="quiz/:id/review" component={QuizReview})
`)
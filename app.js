var _ = require("lodash");
var moment = require("moment");
var express = require("express");
var logger = require("yy-logger");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var conf = require("./conf")

var fe = require("yy-fe");

var uploadMiddleware = fe.middleware.upload;
var loggerMiddleware = fe.middleware.logger;
var errorMiddleware = fe.middleware.error;
var fetchMiddleware = fe.middleware.fetch;
var serverRenderMiddleware = fe.middleware.serverRender;
var transmitMiddleware = fe.util.Transmit;

var fetch = fetchMiddleware(conf.backend.host, conf.backend.port);
var transmit = transmitMiddleware(conf.backend.host, conf.backend.port);
var render = serverRenderMiddleware(__dirname, conf.backend.host, conf.backend.port);

var app = express();
app.set('views', __dirname + '/jade');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/static', express.static(__dirname + '/static'));
app.use("/upload", uploadMiddleware("static/files"));
app.use(fetch); // fetch接口依赖的数据不需要transmit了,可能绕过权限
app.use(bodyParser.json());
app.use(loggerMiddleware());
app.use(errorMiddleware());

app.ajaxGet = function(url, fn){
    return app.use(url, function(req, res, next){
        if(req.xhr){
            return fn(req, res)
        }else{
            return next()
        }
    })
}

process.on("uncaughtException", function(err) {
    logger.error(JSON.stringify(err.stack));
});

app.ajaxGet("/quiz", transmit)

app.ajaxGet("/quiz/:id", transmit)

app.post("/quiz", transmit)

app.ajaxGet("/quiz/:id/questions", transmit)

app.ajaxGet("/question/:id", transmit)

app.put("/quiz/:id", transmit)

app.put("/quiz/:id/question/:qid", transmit)

app.get("/*", function(req, res){
    res.render("App")
})

app.listen(conf.port, function(err) {
    if (err) {
        logger.error(JSON.stringify(err));
    } else {
        logger.log(`Start Web Server On [80] Succ .....`);
    }
});

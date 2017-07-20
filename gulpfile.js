var fe = require("yy-fe");

fe.gulp(__dirname, {
    "GoogleMap": "/static/js/GoogleMap.js",
    "hotel_destination": "/static/js/hotel_destination.js",
    "jquery_ui_css": "//cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.css",
    "jquery_ui_js": "//cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js",
}, ["GoogleMap", "hotel_destination", "jquery_ui_css", "jquery_ui_js"], []);

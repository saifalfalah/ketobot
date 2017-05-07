"use strict";

var forever = require("forever-monitor");

var child = new(forever.Monitor)("index.js", {
    silent: false
});

child.on("exit", function() {
    console.log("ketobot has exited");
});
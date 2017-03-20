require("dotenv").config();
var request = require("request");
var http = require("http");

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';
var PORT = process.env.PORT || 3000;

var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// rtm.start();

rtm.on(RTM_EVENTS.TEAM_JOIN, function(user) {
    // console.log(user);
    request.post({url:'https://slack.com/api/im.open', form: {token:bot_token, user: user.user.id}}, function(err, httpResponse, body) {
        if (err) throw err;
        var bodyObject = JSON.parse(body);
        request.post({url:'https://slack.com/api/chat.postMessage', form: {token:bot_token, channel: bodyObject.channel.id, text: "Hello " + user.user.profile.first_name + ". Welcome to the Desi Keto Slack Group.", username: 'ketobot'}}, function(err, httpResponse, body) {
            console.log(body);
        });
        // if (!json.already_open || json.already_open !== undefined || !json.no_op || json.no_op !== undefined) {
        //     rtm.sendMessage("Hello " + user.user.profile.first_name + ".", json.channel.id);
        // }
        // rtm.sendMessage("Hello " + user.user.profile.first_name + ".", bodyObject.channel.id);
    });
});

var server = http.createServer(function(req, res) {
    res.statusCode = 200;
});

server.listen(PORT, function() {
    rtm.start();
})
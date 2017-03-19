require("dotenv").config();
var request = require("request");

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.start();

rtm.on(RTM_EVENTS.TEAM_JOIN, function(user) {
    request.post({url:'https://slack.com/api/im.open', form: {token:bot_token, user: user.user.id}}, function(err,httpResponse,body){
        if (err) throw err;
        var json = JSON.parse(body);
        rtm.sendMessage("Hello new user", json.channel.id);
    });
});
require("dotenv").config();

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_TEAM_JOIN = require('@slack/client').te


var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.start();

// var channel = "C4HQTC38B";

// rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
//   rtm.sendMessage("Hello!", channel);
// });

// rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
//   console.log('Message:', message); //this is no doubt the lamest possible message handler, but you get the idea
// });

rtm.on(RTM_EVENTS.TEAM_JOIN, function(user) {
    console.log(user);
    console.log(user.user.id);
    rtm.sendMessage("Hello", user.user.id);
});
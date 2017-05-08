"use strict";

require("dotenv").config();
var request = require("request");
var http = require("http");

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';
var PORT = process.env.PORT || 3000;

var rtm = new RtmClient(bot_token);
console.log("Connecting...");

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// Event raised in case a new member joins the team.
rtm.on(RTM_EVENTS.TEAM_JOIN, function (user) {
    // sending a post request to open a DM and get the DM ID
    request.post({ url: 'https://slack.com/api/im.open', form: { token: bot_token, user: user.user.id } }, function (err, httpResponse, body) {
        if (err) throw err;
        // parsing to JSON because the response received is a String
        var bodyObject = JSON.parse(body);
        // using the Web API to send the message. Using the DM ID we have received
        request.post({ url: 'https://slack.com/api/chat.postMessage', form: { token: bot_token, channel: bodyObject.channel.id, text: "Hello " + user.user.profile.first_name + ". Welcome to the Desi Keto Slack Group.", username: 'ketobot' } }, function (err, httpResponse, body) {
            console.log(body);
        });
        // We can also use the RTM API to send the message. Like below:
        // rtm.sendMessage("Hello " + user.user.profile.first_name + ".", bodyObject.channel.id);
    });
});

// Event raised in case of a message to the bot.
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    // ignoring private messages from Slackbot. Not ignoring messages like these cause Ketobot to malfunction and post duplicate messages.

    // if ((message.username !== "slackbot" && message.subtype !== "bot_message" && message.subtype !== "channel_join") || (message.message.user !== "U4H6XBUQH" || message.user !== "U4H6XBUQH")) {

    if (message.username !== "slackbot" && message.subtype !== "bot_message" && message.subtype !== "channel_join" && message.subtype !== "message_changed" && message.user !== "U4H6XBUQH") {
            // console.log(message);
            // toLowerCase to ignore cases.
            if (message.text.toLowerCase() === "help") rtm.sendMessage("*I know the following commands: 🚀*\n*admins:* to see the list of admins\n*creator:* to see the creator of the bot.\n*code:* to see my internal code", message.channel);
            else if (message.text.toLowerCase() === "admins") rtm.sendMessage("The admins of Desi Keto are: @mads 👩‍", message.channel);
            else if (message.text.toLowerCase() === "creator") rtm.sendMessage("My creator is: <@U4J00A9BP|saifalfalah> 👨🏻‍💻.\n\nIf you have any questions about this bot, don't hesitate to DM him 🙌🏿.", message.channel);
            else if (message.text.toLowerCase() === "code") rtm.sendMessage("My code repository is: https://github.com/saifalfalah/ketobot.\n\nMy code is licensed under the MIT license. Feel free to fork my repo. 🙌", message.channel);
            else rtm.sendMessage("Beep boop. I can't understand what you're saying. I'm only a dumb bot 🤖.\n\n*Type 'help' for a list of my commands.*\n\nPlease message 💌 the admins if you have any further questions. 🙌", message.channel);
    }
    // in case of message from Slackbot, we log it to the terminal.
    // else console.log("\n\nFROM SLACKBOT:\n\n" + message);
});

// defining a server
var server = http.createServer(function (req, res) {
    res.statusCode = 200;
});

// exposing a port for deployment.
server.listen(PORT, function () {
    rtm.start();
});
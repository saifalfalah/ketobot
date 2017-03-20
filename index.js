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

rtm.on(RTM_EVENTS.HELLO, function(hello) {
    console.log(hello);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    // console.log(message);
    if (message.username !== "slackbot") {
        if (message.text === "help") rtm.sendMessage("*I know the following commands:*\n*mods:* to see the list of mods\n*creator:* to see the creator of the bot.\n*code:* to see my internal code", message.channel);
        else if (message.text === "mods") rtm.sendMessage("Mods are: @mads", message.channel);
        else if (message.text === "creator") rtm.sendMessage("Creator is: <@U4J00A9BP|saifalfalah>", message.channel);
        else if (message.text === "code") rtm.sendMessage("My code repository is: https://github.com/saifalfalah/ketobot. Feel free to use my code. 🙌", message.channel);
        else rtm.sendMessage("Beep boop. I can't understand what you're saying. I'm only a dumb bot 🤖. *Type 'help' for a list of my commands.* Please message 💌 the admins if you have any further questions. 🙌", message.channel) 
    }
    else console.log(message);
});

var server = http.createServer(function(req, res) {
    res.statusCode = 200;
});

server.listen(PORT, function() {
    rtm.start();
})
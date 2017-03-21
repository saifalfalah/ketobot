# ketobot

Ketobot is a Welcome Bot for the Desi Keto community. Join our community here: https://desi-keto-signup.herokuapp.com/

## Setup

Fork this project.

Navigate to the directory you want this project to be in.

Run ```git clone https://github.com/your-username-here/ketobot.git && cd ketobot```

Run ```npm install```

Run ```npm run setup``` to create the .env file.

Add a new bot custom integration for you Slack Team. Make a note of your bot's API key. The API key for your bot would start with ```xoxb-```

Paste the bot API key into .env file.

Run ```npm run start``` to initialize and run the ketobot.

## Deployment

In production, ketobot has been deployed on Zeit Now.

To deploy the ketobot to the server, first download the Now CLI from <https://zeit.co/download> and login.

Add the bot token as a secret by running ```now secrets add ketobot_token "you-token-value-in-quotes"```

Finally, deploy it to the server. Run ```now -e SLACK_BOT_TOKEN=@ketobot_token```

Now CLI will upload and deploy your instance of ketobot to the server.





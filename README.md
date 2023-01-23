# Simple Discord Music Bot

### Why?
I wanted to experiment with [discord.js]().

### Will you add \<feature>?
Nah, this is just a proof of concept.

### Can I add this bot to my server?
Sure, go ahead and host it yourself.

## Instructions
First, install dependencies:
```
npm i
```

While that happens, create your own application in the [Discord Developer Portal](https://discord.com/developers/applications). In the "Bot" tab, click on "Add Bot", then generate a new token. Now you can copy `config.example.json` into `config.json` and fill it with your Application ID and Discord Bot Token.

Then, deploy your commands:
```
npm run deploy-commands
```
This will also give you a link to invite the bot to any server.

Finally, type this to start the bot:
```
npm start
```
Enjoy!

## OAuth2 permissions
If for some reason you want to change the bot permissions, you can visit [this page](https://discordapi.com/permissions.html#17825792) and generate a custom link.

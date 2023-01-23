const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { applicationId, token } = require(path.join(process.cwd(), 'config.json'));

if (!(applicationId && token))
	throw 'Check your config.json!';

const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(applicationId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

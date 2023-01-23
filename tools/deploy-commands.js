const fs = require('node:fs');
const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { applicationId, token } = require(path.join(process.cwd(), 'config.json'));
const permissions = 17825792

if (!(applicationId && token))
	throw 'Check your config.json!';

const commands = new Array();
const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(applicationId), { body: commands })
	.then((data) => console.log(`
Successfully registered ${data.length} application commands.
Bot invite link: https://discord.com/api/oauth2/authorize?client_id=${applicationId}&permissions=${permissions}&scope=bot`))
	.catch(console.error);

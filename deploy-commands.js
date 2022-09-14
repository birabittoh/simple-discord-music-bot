const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('outro').setDescription('Leave voice channel with an outro.'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

/*
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
	*/
rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
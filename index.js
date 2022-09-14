const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType, PresenceUpdateStatus, Presence } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

function getRandomInt(max) { // not inclusive
	return Math.floor(Math.random() * (max));
  }

const activities = [
	{ activity: ActivityType.Watching, subject: 'i cantieri'}, // sta guardando i cantieri
	{ activity: ActivityType.Playing, subject: 'briscola'}, // sta giocando a briscola
	{ activity: ActivityType.Competing, subject: 'prato fiorito'}, // in competizione su prato fiorito

	{ activity: ActivityType.Watching, subject: 'i bambini'},
	{ activity: ActivityType.Playing, subject: 'quel gioco là non mi viene il titolo'},
	{ activity: ActivityType.Competing, subject: 'cacata ranked al cesso pubblico'},
]

client.once('ready', () => {
	choice = activities[getRandomInt(activities.length)]
	
	client.user.setActivity(choice.subject, { type: choice.activity })
	console.log('Bot online!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
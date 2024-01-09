import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits, ActivityType, BaseInteraction } from 'discord.js';
import { SlashCommand } from "./types";
const { token } = require(path.join(process.cwd(), 'config.json'));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.slashCommands = new Collection<string, SlashCommand>();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.slashCommands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once('ready', () => {
    client.user.setActivity('FOSS', { type: ActivityType.Competing });
    console.log('Bot online!');
});

client.on('interactionCreate', async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

if (!token)
    throw 'Check your config.json!';

client.login(token);

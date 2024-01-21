import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getQueue } from '../functions/music';
import { getChannel } from '../functions/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        const queue = getQueue(interaction.guildId);
        queue.clear()
        return await interaction.reply({ content: 'Queue cleared.' });
    },
};

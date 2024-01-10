import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getChannel, queue } from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        queue.clear()
        return await interaction.reply({ content: 'Queue cleared.' });
    },
};

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import * as music from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await music.getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        music.clearQueue()
        return await interaction.reply({ content: 'Queue cleared.' });
    },
};

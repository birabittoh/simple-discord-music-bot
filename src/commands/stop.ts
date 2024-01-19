import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getChannel, getQueue } from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and leaves the voice channel.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        const queue = getQueue(interaction.guildId);
        const r = queue.stop();
        if (r)
            return await interaction.reply({ content: 'Stopped.' });

        return await interaction.reply({ content: 'Error.', ephemeral: true });
    },
};

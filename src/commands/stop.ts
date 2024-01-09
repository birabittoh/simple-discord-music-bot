import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getChannel, stopMusic } from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        if (stopMusic())
            return await interaction.reply({ content: 'Stopped.', ephemeral: true });

        return await interaction.reply({ content: 'Error.', ephemeral: true });
    },
};

const { SlashCommandBuilder } = require('discord.js');
const { getChannel } = require('../functions/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music.'),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        if (player) player.stop();
        return await interaction.reply({ content: 'Stopped.', ephemeral: true });
    },
};

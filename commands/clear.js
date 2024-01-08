const { SlashCommandBuilder } = require('discord.js');
const { getChannel, clearQueue } = require('../functions/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue.'),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });
        
        if (clearQueue())
            return await interaction.reply({ content: 'Queue cleared.' });

        return await interaction.reply({ content: 'Error.' });
    },
};

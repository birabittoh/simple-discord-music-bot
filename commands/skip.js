const { SlashCommandBuilder } = require('discord.js');
const { getChannel, skipMusic } = require('../functions/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current track.'),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const result = await skipMusic();
        return await interaction.reply({ content: 'Skipped.' });
        //return await interaction.reply({ content: 'Error: couldn\'t skip.', ephemeral: true });
    },
};

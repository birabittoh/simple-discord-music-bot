const { SlashCommandBuilder } = require('discord.js');
const { getChannel, getQueue } = require('../functions/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show current queue status.'),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const result = await getQueue();
        if (result) {
            let finalReply = "Now playing: " + result.shift() + "\n";
            
            for (r in result) {
                finalReply += "\n" + (r + 1) + ". " + result[r];
            }
            return await interaction.reply({ content: finalReply });
        }
        return await interaction.reply({ content: 'Queue is empty.' });
    },
};

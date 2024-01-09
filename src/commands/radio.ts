import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { playStream, getChannel } from '../functions/music';
import path from 'node:path';
const { radios } = require(path.join(process.cwd(), 'config.json'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Play a custom-defined webradio URL.')
        .addStringOption(option =>
            option.setName('which')
                .setDescription('Select which radio to play')
                .setRequired(false)
                .addChoices(...radios)),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        await interaction.deferReply();

        const radio = interaction.options.getString('which');
        const streamUrl = radio ? radio : radios[0].value;

        playStream(streamUrl, channel);
        return await interaction.editReply('Playing web radio.');
    },
};
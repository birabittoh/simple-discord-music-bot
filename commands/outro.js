const { SlashCommandBuilder } = require('discord.js');
const { playOutro, getChannel } = require('../functions/music');
const path = require('node:path');
const { outros } = require(path.join(process.cwd(), 'config.json'));

function getOutroUrl(outro) {
    if (outro) return outro;
    const randomIndex = Math.floor(Math.random() * (outros.length));
    return outros[randomIndex].value;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('outro')
        .setDescription('Leave with an outro.')
        .addStringOption(option =>
            option.setName('which')
                .setDescription('Select which outro to play')
                .setRequired(false)
                .addChoices(...outros))
        .addStringOption(option =>
            option.setName('kick')
                .setDescription('Do you actually want to log off?')
                .setRequired(false)
                .addChoices({ name: 'Yes', value: 'true', default: 'true' }, { name: 'No', value: 'false' })),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const outro = interaction.options.getString('which');
        const kick = interaction.options.getString('kick');
        const outroUrl = getOutroUrl(outro);
        await playOutro(outroUrl, channel);

        if (kick !== 'false') {
            setTimeout(() => interaction.member.voice.disconnect(), 20_000);
            return await interaction.reply({ content: 'Prepare for takeoff!', ephemeral: true });
        }
        return await interaction.reply({ content: 'Playing outro.', ephemeral: true });
    },
};

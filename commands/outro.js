const { SlashCommandBuilder } = require('discord.js');
const { playUrl, getChannel } = require('../functions/music');

const outros = [
    { name: 'Random!', value: 'random' },
    { name: 'TheFatRat - Xenogenesis', value: 'https://www.youtube.com/watch?v=6N8zvi1VNSc' },
    { name: 'OMFG - Hello', value: 'https://www.youtube.com/watch?v=5nYVNTX0Ib8' },
    { name: 'Pegboard Nerds - Disconnected', value: 'https://www.youtube.com/watch?v=YdBtx8qG68w' },
    { name: 'Gym Class Heroes - Stereo Hearts', value: 'https://www.youtube.com/watch?v=ThctmvQ3NGk' },
];

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
                .addChoices({ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' })),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const outro = interaction.options.getString('which');
        const kick = interaction.options.getString('kick');
        const randomIndex = Math.floor(Math.random() * (outros.length - 1)) + 1;
        const outro_file = outro ? outro : outros[randomIndex].value;
        await playUrl(outro_file, channel);

        const kick_switch = kick ? kick : 'true';
        if (kick_switch == 'true') {
            setTimeout(() => interaction.member.voice.disconnect(), 20_000);
            return await interaction.reply({ content: 'Prepare for takeoff!', ephemeral: true });
        }
        return await interaction.reply({ content: 'Playing outro.', ephemeral: true });
    },
};

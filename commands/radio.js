const { SlashCommandBuilder } = require('discord.js');
const { playStream, getChannel } = require('../functions/music');

// const reg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

const radios = [
    { name: 'EusariRadio', value: 'https://onair7.xdevel.com/proxy/xautocloud_cnou_1049?mp=/;stream/' },
    { name: 'Radio 24', value: 'https://shoutcast3.radio24.ilsole24ore.com/stream.mp3' },
    { name: 'Radio Delfino', value: 'https://nr8.newradio.it/proxy/emaamo00?mp=/stream?ext=.mp3' },
    { name: 'Radio 105', value: 'https://icy.unitedradio.it/Radio105.mp3' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Play a custom-defined webradio URL.')
        .addStringOption(option =>
            option.setName('which')
                .setDescription('Select which radio to play')
                .setRequired(false)
                .addChoices(...radios)),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        await interaction.deferReply();

        // Get the YouTube URL or search query
        const radio = interaction.options.getString('which');
        const streamUrl = radio ? radio : radios[0].value;

        playStream(streamUrl, channel);
        return await interaction.editReply('Playing web radio.');
    },
};

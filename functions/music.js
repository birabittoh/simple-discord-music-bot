const {
    createAudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
    async playUrl(url, channel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        const stream = await play.stream(url);
        const guild = channel.guild;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        player = createAudioPlayer();
        player.on(AudioPlayerStatus.Idle, () => {
            player.subscribers.forEach((element) => element.connection.disconnect());
        });

        player.play(createAudioResource(stream.stream, { inputType: stream.type }));
        connection.subscribe(player);
    },
    async playStream(url, channel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        const guild = channel.guild;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        player = createAudioPlayer();
        player.on(AudioPlayerStatus.Idle, () => {
            player.subscribers.forEach((element) => element.connection.disconnect());
        });

        player.play(createAudioResource(url, { inputType: 'mp3' })); // 'opus', 'mp3'
        connection.subscribe(player);
    },
    async getChannel(interaction) {
        const member = interaction.member;
        if (!member)
            return 'Please use this in your current server.';

        const channel = member.voice.channel;
        if (!channel)
            return 'You\'re not in a voice channel.';

        return channel;
    },
};
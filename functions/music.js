const {
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const play = require('play-dl');
const { MyQueue } = require('./myqueue')

const q = new MyQueue();

function getChannelConnection(channel) {
    const guild = channel.guild;
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    })
}

module.exports = {
    async playUrls(urls, channel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }

        q.connection = getChannelConnection(channel);
        return q.addArray(urls);
    },
    async playStream(url, channel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        q.connection = getChannelConnection(channel);
        q.add(createAudioResource(url, { inputType: 'mp3' }));
    },
    async playOutro(url, channel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        q.connection = getChannelConnection(channel);
        q.outro(url);
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
    async stopMusic() {
        return q.stop();
    },
    async skipMusic() {
        return q.next();
    },
    async getQueue() {
        return q.queue;
    },
    clearQueue() {
        return q.clear();
    }
};
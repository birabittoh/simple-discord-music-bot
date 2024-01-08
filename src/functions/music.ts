import { createAudioResource, joinVoiceChannel, AudioPlayerStatus, CreateAudioResourceOptions, StreamType } from '@discordjs/voice';
import MyQueue from './myqueue';

const q = new MyQueue();

export function getChannelConnection(channel) {
    const guild = channel.guild;
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    });
}

export async function playUrls(urls, channel) {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }

    q.connection = getChannelConnection(channel);
    return q.addArray(urls);
}

export async function playStream(url, channel) {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }
    q.connection = getChannelConnection(channel);
    q.add(createAudioResource(url, { inputType: StreamType.Opus }));
}

export async function playOutro(url, channel) {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }
    q.connection = getChannelConnection(channel);
    q.outro(url);
}

export async function getChannel(interaction) {
    const member = interaction.member;
    if (!member)
        return 'Please use this in your current server.';

    const channel = member.voice.channel;
    if (!channel)
        return 'You\'re not in a voice channel.';

    return channel;
}

export async function stopMusic() {
    return q.stop();
}

export async function skipMusic() {
    return q.next();
}

export async function getQueue() {
    return q.queue;
}

export function clearQueue() {
    return q.clear();
}

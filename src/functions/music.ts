import { joinVoiceChannel } from '@discordjs/voice';
import { ChatInputCommandInteraction, VoiceBasedChannel } from 'discord.js'
import MyQueue from './myqueue';
import { YouTubeVideo } from 'play-dl';

const q = new MyQueue();

export function formatTitle(video: YouTubeVideo): string {
    return `**${video.title}** (\`${video.durationRaw}\`)`
}

export function getChannelConnection(channel: VoiceBasedChannel) {
    const guild = channel.guild;
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    });
}

export async function playUrls(videos: YouTubeVideo[], channel: VoiceBasedChannel): Promise<YouTubeVideo[]> {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }

    q.connection = getChannelConnection(channel);
    return await q.addArray(videos);
}
/* Only useful for radio
export async function playStream(url: string, channel: VoiceBasedChannel) {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }
    q.connection = getChannelConnection(channel);
    q.add(createAudioResource(url, { inputType: StreamType.Opus }));
}
*/

export async function playOutro(url: string, channel: VoiceBasedChannel) {
    if (!channel) {
        console.log('Channel error:', channel);
        return;
    }
    q.connection = getChannelConnection(channel);
    q.outro(url);
}

export async function getChannel(interaction: ChatInputCommandInteraction): Promise<string | VoiceBasedChannel>{
    const member = interaction.member;
    if (!member)
        return 'Please use this in your current server.';

    const vc_error = 'You\'re not in a voice channel.';

    if (!("voice" in member)) return vc_error;
    const channel: VoiceBasedChannel = member.voice.channel;
    return channel ? channel : vc_error;
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

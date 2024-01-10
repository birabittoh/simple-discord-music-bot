import { createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnection, AudioPlayer, AudioResource, joinVoiceChannel } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import play, { YouTubeVideo } from 'play-dl';

export function getChannelConnection(channel: VoiceBasedChannel) {
    const guild = channel.guild;
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
    });
}

async function resourceFromYTUrl(url: string): Promise<AudioResource<null>> {
    try {
        const stream = await play.stream(url);
        return createAudioResource(stream.stream, { inputType: stream.type })
    } catch (error) {
        return null;
    }
    
}

export default class MyQueue {
    #nowPlaying: YouTubeVideo;
    #queue: Array<YouTubeVideo>;
    connection: VoiceConnection;
    player: AudioPlayer;
    
    get queue() {
        if (this.#nowPlaying)
            return [this.#nowPlaying].concat(this.#queue);
        return null
    }

    constructor() {
        this.#nowPlaying = null;
        this.connection = null;
        this.#queue = Array<YouTubeVideo>();
        this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Stop } });
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.#queue.length > 0) 
                return this.next();
            this.connection.disconnect();
        });
    }

    clear() {
        this.#queue = Array<YouTubeVideo>();
    }

    stop(): boolean {
        this.clear();
        this.#nowPlaying = null;
        if (this.player) {
            const p = this.player.stop();
            const c = this.connection.disconnect();
            return p && c;
        }
        return false;
    }

    async next() {
        if (this.#queue.length == 0)
            return this.stop();
        this.#nowPlaying = this.#queue.shift();
        const resource = await resourceFromYTUrl(this.#nowPlaying.url);
        if (!resource) {
            return await this.next();
        }
        this.player.play(resource);
        this.connection.subscribe(this.player);
    }

    add(video: YouTubeVideo, position=this.#queue.length) {
        const l = this.#queue.length;
        const normalizedPosition = position % (l + 1);
        this.#queue.splice(normalizedPosition, 0, video);
        if (l == 0) this.next();
    }

    async addArray(videos: YouTubeVideo[], channel: VoiceBasedChannel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        if (videos.length == 0) return [];
        this.connection = getChannelConnection(channel);

        const l = this.#queue.length;
        this.#queue.push(...videos);
        if (l == 0 && this.player.state.status == AudioPlayerStatus.Idle) this.next();
        return videos;
    }

    pause() {
        this.player.pause();
    }

    resume() {
        this.player.unpause();
        this.connection.subscribe(this.player);
    }

    async outro(url: string, channel: VoiceBasedChannel) {
        if (!channel) {
            console.log('Channel error:', channel);
            return;
        }
        this.connection = getChannelConnection(channel);

        this.player.pause();
        const resource = await resourceFromYTUrl(url);

        const p = createAudioPlayer();
        p.on(AudioPlayerStatus.Idle, () => {
            if (this.player.state.status == AudioPlayerStatus.Paused) {
                this.resume();
                return
            }
            this.connection.disconnect();
        });

        p.play(resource);
        this.connection.subscribe(p);
    }
}

(module).exports = MyQueue;

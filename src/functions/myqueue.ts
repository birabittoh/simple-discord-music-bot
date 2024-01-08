import { createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnection, AudioPlayer } from '@discordjs/voice';
import play from 'play-dl';

async function resourceFromUrl(url) {
    const stream = await play.stream(url);
    return createAudioResource(stream.stream, { inputType: stream.type })
}

export default class MyQueue {
    #nowPlaying = null;
    #queue = Array();
    connection: VoiceConnection;
    player: AudioPlayer;
    static _instance: MyQueue;
    get queue() {
        if (this.#nowPlaying)
            return [this.#nowPlaying].concat(this.#queue);
        return null
    }

    constructor() {
        if (MyQueue._instance) {
            return MyQueue._instance
        }
        MyQueue._instance = this;

        this.#nowPlaying = "";
        this.connection = null;
        this.#queue = Array();
        this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Stop } });
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.#queue.length > 0) 
                return this.next();
            //@ts-expect-error
            this.player.subscribers.forEach((e) => e.connection.disconnect());
        });
    }

    clear() {
        this.#queue = Array();
    }

    stop() {
        this.clear();
        this.#nowPlaying = null;
        if (this.player) return this.player.stop();
        return false;
    }

    async next() {
        if (this.#queue.length == 0)
            return this.stop();
        this.#nowPlaying = this.#queue.shift();
        const resource = await resourceFromUrl(this.#nowPlaying);
        this.player.play(resource);
        this.connection.subscribe(this.player);
    }

    add(url, position=this.#queue.length) {
        const l = this.#queue.length;
        const normalizedPosition = position % (l + 1);
        this.#queue.splice(normalizedPosition, 0, url);
        if (l == 0) this.next();
    }

    async addArray(urls) {
        const l = this.#queue.length;
        this.#queue.push(...urls);
        if (l == 0 && this.player.state.status == AudioPlayerStatus.Idle) this.next();
        return l != this.#queue.length;
    }

    pause() {
        this.player.pause();
    }

    resume() {
        this.player.unpause();
        this.connection.subscribe(this.player);
    }

    async outro(url) {
        this.player.pause();
        const resource = await resourceFromUrl(url);

        const p = createAudioPlayer();
        p.on(AudioPlayerStatus.Idle, () => {
            if (this.player.state.status == AudioPlayerStatus.Paused) {
                this.resume();
                return
            }
            //@ts-expect-error
            p.subscribers.forEach((e) => e.connection.disconnect());
        });

        p.play(resource);
        this.connection.subscribe(p);
    }
}

(module).exports = MyQueue;

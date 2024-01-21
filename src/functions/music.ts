import { YouTubeVideo } from 'play-dl';
import MyQueue from './myqueue';

const queues = new Map<string, MyQueue>();

export function getQueue(server: string): MyQueue {
    if (queues.has(server))
        return queues.get(server);
    
    const q = new MyQueue();
    queues.set(server, q);
    return q;
}

export function formatTitle(video: YouTubeVideo): string {
    return `**${video.title}** (\`${video.durationRaw}\`)`;
}

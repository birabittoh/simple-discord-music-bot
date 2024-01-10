import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { formatTitle, getChannel, getQueue } from '../functions/music';
import { YouTubeVideo } from 'play-dl';

const CHARACTER_LIMIT_API = 2000;

function getReply(result: YouTubeVideo[]): string {
    const nowPlaying = "Now playing: " + formatTitle(result.shift());

    if (!result.length) {
        return nowPlaying;
    }

    let reply = "Queue:"
    const characterLimit = CHARACTER_LIMIT_API - nowPlaying.length - 6; // 4 chars for "\n...", 2 chars for "\n\n"

    for (let r in result) {
        const video = result[r];
        const new_string = `\n${r + 1}. ${formatTitle(video)}`;
        if (reply.length + new_string.length > characterLimit) {
            reply += "\n...";
            break;
        }
        reply += new_string;
    }
    return reply + "\n\n" + nowPlaying;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show current queue status.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const queue = getQueue(interaction.guildId);
        const result = queue.queue;
        if (result) {
            const reply = getReply(result);
            return await interaction.reply({ content: reply });
        }
        return await interaction.reply({ content: 'Queue is empty.' });
    },
};

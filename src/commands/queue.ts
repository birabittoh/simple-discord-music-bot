import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getChannel, getQueue } from '../functions/music';

const CHARACTER_LIMIT_API = 2000;

function getReply(result: string[]): string {
    const nowPlaying = "Now playing: " + result.shift()

    if (!result.length) {
        return nowPlaying;
    }

    let reply = "Queue:"
    let new_string = "";
    const characterLimit = CHARACTER_LIMIT_API - nowPlaying.length - 6; // 4 chars for "\n...", 2 chars for "\n\n"

    for (let r in result) {
        new_string = "\n" + (r + 1) + ". <" + result[r] + ">";
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

        const result = await getQueue();
        if (result) {
            const reply = getReply(result);
            return await interaction.reply({ content: reply });
        }
        return await interaction.reply({ content: 'Queue is empty.' });
    },
};

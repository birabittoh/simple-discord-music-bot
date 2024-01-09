import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import play, { YouTubeVideo } from 'play-dl';
import { playUrls, getChannel, formatTitle } from '../functions/music';

async function handleUserInput(input: string): Promise<YouTubeVideo[]> {
    try {
        switch (play.yt_validate(input)) {
            case 'video':
                const info = await play.video_basic_info(input);
                return [info.video_details];
            case 'playlist':
                const playlist = await play.playlist_info(input, { incomplete: true });
                return await playlist.all_videos();
            case 'search':
                const results = await play.search(input, { source: { youtube: 'video' }, limit: 1 });
                if (results.length > 0) return [results[0]];
            default:
                return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play something off YouTube.')
        .addStringOption((option) => option
            .setName('query')
            .setDescription('YouTube URL or search query')
            .setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        await interaction.deferReply();
        const opt = interaction.options;
        const input = opt.getString('query');
        const yt_videos = await handleUserInput(input);
        const added = await playUrls(yt_videos, channel);

        switch (added.length) {
            case 0:
                return await interaction.editReply('No videos were added to the queue.');
            case 1:
                return await interaction.editReply(`Added ${formatTitle(added[0])} to queue.`);
            default:
                return await interaction.editReply(`Added ${added.length} videos to queue.`);
        }
    },
};

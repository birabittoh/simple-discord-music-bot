import { SlashCommandBuilder } from 'discord.js';
import play from 'play-dl';
import { playUrls, getChannel } from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play something off YouTube.')
        .addStringOption((option) => option
            .setName('query')
            .setDescription('YouTube URL or search query')
            .setRequired(true),
        ),

    async execute(interaction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        await interaction.deferReply();
        const url = interaction.options.getString('query');

        let video, yt_info;
        switch (play.yt_validate(url)) {
            case 'video':
                playUrls([url], channel);
                return await interaction.editReply(`Added ${url} to queue.`);

            case 'search':
                yt_info = await play.search(url, { source: { youtube: 'video' }, limit: 1 });

                if (yt_info.length === 0)
                    return await interaction.editReply('No results found.');

                video = yt_info[0];
                playUrls([video.url], channel);
                return await interaction.editReply(`Added ${video.url} to queue.`);

            case 'playlist':
                const playlist = await play.playlist_info(url, { incomplete : true });
                const videos = await playlist.all_videos();
                const urls = videos.map((e) => e.url);
                const result = await playUrls(urls, channel);
                if (result)
                    return await interaction.editReply(`Added ${urls.length} videos from the following playlist: ${playlist.title}.`);
                else
                    return await interaction.editReply(`Could not add playlist.`);
            default:
                return await interaction.editReply('Not supported.');
        }
    },
};

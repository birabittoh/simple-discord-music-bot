const { SlashCommandBuilder } = require("discord.js");
const play = require('play-dl');
const { playUrl, getChannel } = require("../functions/music");

//const reg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play something off YouTube.")
    .addStringOption((option) => option
        .setName("query")
        .setDescription("YouTube URL or search query")
        .setRequired(true)
    ),

  async execute(interaction) {
    
    channel = await getChannel(interaction);
    if (typeof channel == "string")
      return await interaction.reply({ content: channel, ephemeral: true });

    await interaction.deferReply();

    // Get the YouTube URL or search query
    let url = interaction.options.getString("query");

    let video;
    switch (play.yt_validate(url)) {
      case "video":
        video = {url: url};
        break;
      
      case "search":
        yt_info = await play.search(url, { source : { youtube : "video" }, limit: 1 });

        if(yt_info.length === 0)
          return await interaction.editReply(`No results found.`);

        video = yt_info[0];
        break;
    
      default:
        return await interaction.editReply(`Not supported.`);
    }

    playUrl(video.url, channel);
    return await interaction.editReply(`Playing ${video.url}`);
  },
};

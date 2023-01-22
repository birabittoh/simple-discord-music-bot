const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const play = require('play-dl')

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
    const member = interaction.member;
    if (!member)
      return await interaction.reply({ content: "Please use this in your current server.", ephemeral: true });

    const user_connection = member.voice;
    const channel = user_connection.channel;

    if (!channel)
      return await interaction.reply({ content: "You're not in a voice channel.", ephemeral: true });

    await interaction.deferReply();
    const guild = channel.guild;

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
    let stream = await play.stream(video.url);

    // Connect to the user's voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type
    })

    player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    player.on(AudioPlayerStatus.Idle, () => {
      player.stop();
      player.subscribers.forEach((element) => element.connection.disconnect());
    });

    player.play(resource);
    connection.subscribe(player);
    return await interaction.editReply(`Playing ${video.url}`);
  },
};

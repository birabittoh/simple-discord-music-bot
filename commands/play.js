const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

async function reply_efemeral(interaction, reply) {
  return await interaction.reply({ content: reply, ephemeral: true });
}

function get_player(resource) {
  const player = createAudioPlayer({
    behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
  });
  player.on("error", (error) =>
    console.error(
      `Error: ${error.message} with resource ${error.resource.metadata.title}`
    )
  );
  player.on(AudioPlayerStatus.Idle, () => {
    player.stop();
    player.subscribers.forEach((element) => element.connection.disconnect());
  });

  player.play(createAudioResource(resource));
  return player;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play something off YouTube.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("YouTube URL or search query")
        .setRequired(true)
    ),

  async execute(interaction) {
    const member = interaction.member;
    if (!member)
      return await reply_efemeral(
        interaction,
        "Please use this in your current server."
      );

    const user_connection = member.voice;
    const channel = user_connection.channel;
    if (!channel)
      return await reply_efemeral(
        interaction,
        "You're not in a voice channel."
      );

    const guild = channel.guild;

    // Get the YouTube URL or search query
    const url = interaction.options.getString("query");

    // If the URL is not a valid YouTube URL, treat it as a search query and try to get the first result

    if (!ytdl.validateURL(url)) {
        return await reply_efemeral(interaction, "This bot only supports URLs (for now).");
      try {
        const searchResults = await ytsr(url);
        results = searchResults.items;

        url = null
        for(result in results){
            if (result.type == "video"){
                url = result.url;
                console.log("Using", url)
                break;
            }
        }
        if(url == null) {
            console.log("No results found");
            throw new Error("No results found");
        }
      } catch (error) {
        return await reply_efemeral(
          interaction,
          `Invalid YouTube URL or search query! ${error}`
        );
      }
    }

    const stream = ytdl(url, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: ["-af", "bass=g=10,dynaudnorm=f=200"],
    });

    // Connect to the user's voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    connection.subscribe(get_player(stream));
    return await reply_efemeral(interaction, `Playing.`);
  },
};

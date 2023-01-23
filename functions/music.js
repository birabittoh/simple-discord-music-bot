const {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const play = require('play-dl');

module.exports = {
  async playUrl(url, channel) {
    if(!channel){
      console.log("Channel error:", channel);
      return;
    }
    let stream = await play.stream(url);

    // Connect to the user's voice channel
    const guild = channel.guild;

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
  },
  async getChannel(interaction) {

    const member = interaction.member;
    if (!member)
      return "Please use this in your current server.";

    const channel = member.voice.channel;

    if (!channel)
      return "You're not in a voice channel.";

    return channel
  }
};
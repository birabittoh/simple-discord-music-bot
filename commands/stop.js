const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music."),

  async execute(interaction) {

    channel = await getChannel(interaction);
    if (typeof channel == "string")
      return await interaction.reply({ content: channel, ephemeral: true });

    player.stop();
    return await interaction.reply({ content: "Stopped.", ephemeral: true });
  },
};

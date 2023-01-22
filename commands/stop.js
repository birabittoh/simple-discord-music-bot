const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music."),

  async execute(interaction) {
    const member = interaction.member;
    if (!member)
      return await interaction.reply({ content: "Please use this in your current server.", ephemeral: true });

    const user_connection = member.voice;
    const channel = user_connection.channel;

    if (!channel)
      return await interaction.reply({ content: "You're not in a voice channel.", ephemeral: true });

    player.stop();
    return await interaction.reply({ content: "Stopped.", ephemeral: true });
  },
};

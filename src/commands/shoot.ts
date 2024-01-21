import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getChannel } from '../functions/music';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shoot')
        .setDescription('Kick a random member of your voice channel.'),

    async execute(interaction: ChatInputCommandInteraction) {
        const channel = await getChannel(interaction);
        if (typeof channel == 'string')
            return await interaction.reply({ content: channel, ephemeral: true });

        const voiceChannelUsers = interaction.guild.voiceStates.cache.filter(
            (voiceState) => voiceState.channelId === channel.id
        );
        const members = voiceChannelUsers.map((voiceState) => voiceState.member);
        const l = members.length
        const randomIndex = Math.floor(Math.random() * l);
        const toBeKicked = members[randomIndex].user.bot ? members[(randomIndex + 1) % l] : members[randomIndex];

        toBeKicked.voice.disconnect();
        const victimName = toBeKicked.nickname ?? toBeKicked.user.globalName;
        return await interaction.reply({ content: `💥 Bang! **${victimName}** was shot.` });
    },
};

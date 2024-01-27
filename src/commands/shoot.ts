import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, APIInteractionGuildMember } from 'discord.js';
import { getChannel } from '../functions/voice';
import { getMagazine } from '../functions/magazines';

const bustProbability = 0.5;

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

        const magazine = getMagazine(interaction.user.id);
        if (!magazine.shoot())
            return await interaction.reply({ content: `💨 Too bad... You're out of bullets.` });
        
        const allMembers = voiceChannelUsers.map((voiceState) => voiceState.member);
        const killerId = interaction.user.id

        let toBeKicked: GuildMember;
        if (Math.random() >= bustProbability) {
            toBeKicked = allMembers.find((e) => e.user.id === killerId);
        } else {
            const members = allMembers.filter((m) => !m.user.bot && m.user.id != killerId);
            const l = members.length;
            const randomIndex = Math.floor(Math.random() * l);
            toBeKicked = members[randomIndex].user.bot ? members[(randomIndex + 1) % l] : members[randomIndex];
        }

        toBeKicked.voice.disconnect();
        const victimName = toBeKicked.nickname ?? toBeKicked.user.globalName ?? toBeKicked.user.tag;
        return await interaction.reply({ content: `💥 Bang! **${victimName}** was shot. **${magazine.left}/${magazine.size} bullets** left in your magazine.` });
    },
};

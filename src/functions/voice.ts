import { ChatInputCommandInteraction, VoiceBasedChannel } from 'discord.js'

export async function getChannel(interaction: ChatInputCommandInteraction): Promise<string | VoiceBasedChannel>{
    const member = interaction.member;
    if (!member)
        return 'Please use this in your current server.';

    const vc_error = 'You\'re not in a voice channel.';

    if (!("voice" in member)) return vc_error;
    const channel: VoiceBasedChannel = member.voice.channel;
    return channel ? channel : vc_error;
}

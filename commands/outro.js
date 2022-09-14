const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');

const OUTRO_PATH = path.join(process.cwd(), 'resources', 'outro.mp3');

function get_player(resource) {

	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
	});

	player.on(AudioPlayerStatus.Idle, () => {
		player.stop();
		player.subscribers.forEach(element => {
			element.connection.disconnect();
		});
	});

	player.play(createAudioResource(resource));
	return player;
}

module.exports = {
	data: new SlashCommandBuilder().setName('outro').setDescription('Leave with an outro.'),
	async execute(interaction) {

		const member = interaction.member;

		if (!member) return await interaction.reply('Please use this in your current server.');

		const user_connection = member.voice;
		const channel = user_connection.channel;

		if (!channel) return await interaction.reply('You\'re not in a voice channel.');

		const guild = channel.guild;
		const bot_connection = joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });
		const player = get_player(OUTRO_PATH);

		bot_connection.subscribe(player);
		setTimeout(() => user_connection.disconnect(), 20_000);
		return await interaction.reply('Prepare for takeoff.');
	},
};

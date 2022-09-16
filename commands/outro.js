const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');

const outros = [
	{ name: 'Random!', 							value: 'random' },
	{ name: 'TheFatRat - Xenogenesis', 			value: 'thefatrat_xenogenesis.mp3' },
	{ name: 'OMFG - Hello', 					value: 'omfg_hello.mp3' },
	{ name: 'Pegboard Nerds - Disconnected',	value: 'pegboard_nerds_disconnected.mp3' },
	{ name: 'Gym Class Heroes - Stereo Hearts',	value: 'gym_class_heroes_stereo_hearts.mp3' },
];

function get_player(resource) {

	const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });

	player.on('error', error => console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`));
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
	data: new SlashCommandBuilder()
		.setName('outro')
		.setDescription('Leave with an outro.')
		.addStringOption(option =>
			option.setName('which')
				.setDescription('Select which outro to play')
				.setRequired(false)
				.addChoices(...outros)),

	async execute(interaction) {
		const member = interaction.member;
		if (!member) return await interaction.reply({ content: 'Please use this in your current server.', ephemeral: true });

		const user_connection = member.voice;
		const channel = user_connection.channel;
		if (!channel) return await interaction.reply({ content: 'You\'re not in a voice channel.', ephemeral: true });

		const guild = channel.guild;
		const bot_connection = joinVoiceChannel({ channelId: channel.id, guildId: guild.id, adapterCreator: guild.voiceAdapterCreator });

		const outro = interaction.options.getString('which');
		let outro_file = outro ? outro : 'random';
		if (outro_file == 'random')
			outro_file = outros[Math.floor(Math.random() * (outros.length - 1)) + 1].value;

		const song_path = path.join(process.cwd(), 'resources', outro_file);
		bot_connection.subscribe(get_player(song_path));
		setTimeout(() => user_connection.disconnect(), 20_000);

		const outro_title = outros.find(element => element.value == outro_file).name;
		return await interaction.reply({ content: `Prepare for takeoff with ${outro_title}!`, ephemeral: true });
	},
};

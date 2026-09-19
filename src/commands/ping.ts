import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";
import { createEmbed } from "../util/embeds";

const Ping: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Get the bots ping in milliseconds."),
	async execute(interaction, client, ...args) {
		await interaction.editReply({
			embeds: [
				createEmbed(
					"Pinging...",
					"Testing connection speed...",
					[255, 255, 0],
				),
			],
		});

		const reply = await interaction.fetchReply();
		var ping = reply.createdTimestamp - interaction.createdTimestamp;
		const ws =
			Math.round(client.ws.ping) != -1
				? Math.round(client.ws.ping).toString() + "ms"
				: "Not specified";
		await interaction.editReply({
			embeds: [
				createEmbed(
					"Success!",
					`Bot Latency: ${ping}ms\nAPI WebSocket Latency: ${ws}`,
					[0, 255, 0],
				),
			],
		});
	},
};

export default Ping;

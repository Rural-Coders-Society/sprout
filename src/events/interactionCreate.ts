import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import type { Command, Event } from "../types";
import { createErrorEmbed } from "../util/embeds";

const interactionCreate: Event = {
	name: "interactionCreate",
	once: false,
	async execute(client, interaction: Interaction) {
		if (interaction.isCommand()) {
			const command: Command = client.commands.get(
				interaction.commandName,
			);

			if (!command) return console.log("Command not found.");

			const chatInputCommandInteraction: ChatInputCommandInteraction =
				interaction as ChatInputCommandInteraction;

			try {
				await interaction.deferReply();
				await command.execute(chatInputCommandInteraction, client);
			} catch (error) {
				console.log(error);
				await interaction.reply({
					embeds: [
						createErrorEmbed(
							"There was an error while executing the command. If this happens again, please inform the developers of this bot or create an issue [here](https://github.com/Rural-Coders-Society/sprout/issues).",
						),
					],
					ephemeral: true,
				});
			}
		}
	},
};

export default interactionCreate;

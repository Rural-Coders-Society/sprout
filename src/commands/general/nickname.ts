import { GuildMember, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types";
import { createErrorEmbed, createSuccessEmbed } from "../../util/embeds";

const Nickname: Command = {
	data: new SlashCommandBuilder()
		.setName("nickname")
		.setDescription("Set your own nickname!")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription(
					"The nickname you want to set. Leave empty to clear.",
				),
		),
	async execute(interaction, client, ...args) {
		if (interaction.member instanceof GuildMember) {
			try {
				await interaction.member.setNickname(
					interaction.options.getString("name") ?? null,
				);
				await interaction.editReply({
					embeds: [createSuccessEmbed("Your nickname was changed.")],
				});
			} catch (e: unknown) {
				const message = e instanceof Error ? e.message : String(e);

				await interaction.editReply({
					embeds: [createErrorEmbed(message)],
				});
			}
		}
	},
};

export default Nickname;

import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { SproutClient, type Command } from "../types";

export default async function handleCommands(client: SproutClient) {
	console.log("Command handler loaded.");
	client.handleCommands = async (commandFolders, path) => {
		client.commandArray = [];
		for (let folder of commandFolders) {
			const commandFiles = readdirSync(`${path}/${folder}`).filter(
				(file) => file.endsWith(".js") || file.endsWith(".ts"),
			);
			for (const file of commandFiles) {
				const commandModule = await import(
					`../../${path}/${folder}/${file}`
				);
				const command: Command = commandModule.default || commandModule;
				if (command.data && command.data.name) {
					client.commands.set(command.data.name, command);
					client.commandArray.push(command.data.toJSON());
					console.log("[+] command: " + command.data.name);
				} else {
					console.error(
						"Command data or command name is undefined:",
						command,
					);
				}
			}
		}

		const rest = new REST({ version: "10" }).setToken(
			process.env.TOKEN ?? "",
		);

		(async () => {
			try {
				console.log("Started refreshing application (/) commands.");

				console.log(`Loading ${client.commandArray.length} commands.`);

				await rest.put(
					Routes.applicationCommands(process.env.CLIENT_ID || ""),
					{
						body: client.commandArray,
					},
				);

				console.log("Successfully reloaded application (/) commands.");
			} catch (error) {
				console.error(error);
			}
		})();
	};
}

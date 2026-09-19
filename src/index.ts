import { Collection, GatewayIntentBits, Partials } from "discord.js";
import { readdirSync } from "fs";
import { SproutClient, type Reason } from "./types";
import { config } from "dotenv";
import { execSync } from "child_process";

config();

export const revision = execSync("git rev-parse HEAD").toString().trim();

console.log("Sprout @ " + revision);

const client = new SproutClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildModeration,
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

const functions = readdirSync("./src/functions").filter(
	(file) => file.endsWith(".js") || file.endsWith(".ts"),
);
const eventFiles = readdirSync("./src/events").filter(
	(file) => file.endsWith(".js") || file.endsWith(".ts"),
);
const commandFolders = readdirSync("./src/commands");

process.on("unhandledRejection", async (reason: Reason, promise) => {
	if (reason.code === 50007) {
		console.log("User DMs are closed");
	} else {
		console.log("Unhandled Rejection at:", promise, "reason:", reason);
	}

	if (reason.code === 10062) return;
});

process.on("uncaughtException", async (err) => {
	console.log("Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", async (err, origin) => {
	console.log("Uncaught Exception Monitor:", err, origin);
});

(async () => {
	console.log("Loading functions...");
	for (let file of functions) {
		const func = await import(`./functions/${file}`);
		await func.default(client);
	}

	console.log("Loading events...");
	client.handleEvents(eventFiles, "./events");
	console.log("Loading commands...");
	client.handleCommands(commandFolders, "./src/commands");
	console.log("Logging in...");
	client.login(process.env.TOKEN);
})();

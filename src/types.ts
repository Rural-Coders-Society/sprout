import {
	ChatInputCommandInteraction,
	Client,
	Collection,
	SlashCommandBuilder,
	type ClientOptions,
	type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export class SproutClient<Ready extends boolean = boolean> extends Client {
	public constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.commandArray = [];
		this.handleEvents = async (eventFiles: string[], path: string) => {};
		this.handleCommands = async (
			commandFolders: string[],
			path: string,
		) => {};
	}
	handleEvents: (eventFiles: string[], path: string) => Promise<void>;
	handleCommands: (commandFolders: string[], path: string) => Promise<void>;
	commands: Collection<string, any>;
	commandArray: any[];
}

export interface Event {
	name: string;
	once: boolean;
	execute: (client: SproutClient, ...args: any[]) => any;
}

export interface Command {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	execute: (
		interaction: ChatInputCommandInteraction,
		client: SproutClient,
		...args: any[]
	) => any;
}

export interface Reason {
	code: number;
}

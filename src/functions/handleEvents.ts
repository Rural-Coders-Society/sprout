import type { SproutClient, Event } from "../types";

export default async function handleEvents(client: SproutClient) {
	console.log("Event handler loaded.");
	client.handleEvents = async (eventFiles, path) => {
		for (let file of eventFiles) {
			try {
				const eventModule = await import(`../${path}/${file}`);
				const event: Event = eventModule.default;
				if (!event || !event.name) {
					console.error(`Event name is missing in file: ${file}`);
					continue;
				}
				console.log(`[+] event: ${event.name}`);
				if (event.once) {
					client.once(event.name, (...args) =>
						event.execute(client, ...args, client),
					);
				} else {
					client.on(event.name, (...args) =>
						event.execute(client, ...args, client),
					);
				}
			} catch (error) {
				console.error(`Failed to load event from file: ${file}`, error);
			}
		}
	};
}

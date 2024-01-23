import { Client, GatewayIntentBits } from 'discord.js';
import { refetchRoutes } from './routes';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import type { Command } from './types';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandMap = new Map<string, Command>();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const url = new URL(`file://${filePath}`);
    	const command = await import(url.href);

		if ('data' in command && 'execute' in command) {
      		commandMap.set(command.data.toJSON().name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on('ready', async () => {
	const commandsArray = [...commandMap.values()]
	const commandsJSON = commandsArray.map((c) => {
		return c.data.toJSON();
	})
    await refetchRoutes(commandsJSON);
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commandMap.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
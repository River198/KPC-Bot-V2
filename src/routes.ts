import { REST, Routes } from 'discord.js';
import {type Command} from './types'
import dotenv from 'dotenv'

dotenv.config()

export const refetchRoutes = async (commands: Command[]) => {
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || '');
  
  try {
    console.log('Started refreshing application (/) commands.');
  
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || ''), { body: commands });
  
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

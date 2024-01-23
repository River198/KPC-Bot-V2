import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import dotenv from 'dotenv'
import type { Bans } from "../../types.js";

dotenv.config()

export const data = new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Shows everyone who is banned from playing KPC queue');

export async function execute(interaction: ChatInputCommandInteraction) {
    const kpcID = "672146248182136863"
    let bans: Bans = [];

    try {
        const bansResp = await fetch(`https://api.neatqueue.com/api/banlist/${kpcID}`, {
            headers: {
                "Authorization": process.env.NEATQUEUE_API_KEY || ''
            }
        })
        bans = await bansResp.json() as Bans
    } catch {
        interaction.reply({embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("An error has occured. Please try again")], ephemeral: true});
        return;
    }

    const bansEmbed = new EmbedBuilder().setTitle("**Bans**").setColor("Aqua");

    if (bans.length == 0) {
        bansEmbed.addFields({
          name: "No bans",
          value: "\n"
        });
    } else {
        let bannedPlayers = ""

        bans.sort((a, b) => {
            return a.banned_until - b.banned_until;
        })

        bans.forEach((ban) => {
            bannedPlayers += `${ban.name} - ${time(parseInt(ban.banned_until.toFixed()), 'f')} - ${ban.reason == null ? 'None' : ban.reason}\n`
        })

        bansEmbed.addFields({
            name: '\u200b',
            value: bannedPlayers
        });

    }

    interaction.reply({embeds: [bansEmbed]})
    return;
}
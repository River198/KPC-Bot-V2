import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder, inlineCode } from "discord.js";
import type { MatchesResponse } from "../../types";

function isEmpty(obj: Object) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

export const data = new SlashCommandBuilder()
    .setName('matches')
    .setDescription('Shows all ongoing matches in KPC');

export async function execute(interaction: ChatInputCommandInteraction) {
    const kpcID = "672146248182136863"
    let matches: MatchesResponse = {};

    try {
        const matchesResp = await fetch(`https://api.neatqueue.com/api/matches/${kpcID}`)
        matches = await matchesResp.json() as MatchesResponse
    } catch {
        interaction.reply({embeds: [new EmbedBuilder().setColor("Red").setTitle("Error").setDescription("An error has occured. Please try again")], ephemeral: true});
        return;
    }

    const matchesEmbed = new EmbedBuilder().setTitle("**_Matches_**").setColor("Aqua");

    if (isEmpty(matches)) {
        matchesEmbed.addFields({
          name: "No matches",
          value: "\n"
        });
    } else {
        for (const match in matches) {
            const currentMatch = matches[match];

            const allPlayerT1Names: string[] = [];
            const allPlayerT2Names: string[] = [];
            let averageEloT1 = 0;
            let averageEloT2 = 0;

            currentMatch.players.forEach((p) => {
                if(p.team_num == 0) {
                    allPlayerT1Names.push(p.captain ? `${p.name} (C)` : p.name);
                    averageEloT1 += p.mmr
                } else {
                    allPlayerT2Names.push(p.captain ? `${p.name} (C)` : p.name);
                    averageEloT2 += p.mmr
                }
            })
            averageEloT1 /= currentMatch.players.length / 2;
            averageEloT2 /= currentMatch.players.length / 2;

            const playerString = `${inlineCode(allPlayerT1Names.join(', '))} ***VS*** ${inlineCode(allPlayerT2Names.join(', '))}`

            matchesEmbed.addFields({
                name: `Match (${match}) | Ingame | Average Elos: T1 • ${averageEloT1.toFixed()} - T2 • ${averageEloT2.toFixed()}`,
                value: playerString,
            });
        }
    }

    interaction.reply({embeds: [matchesEmbed]})
    return;
}
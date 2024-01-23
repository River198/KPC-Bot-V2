import type { ChatInputCommandInteraction, CacheType } from "discord.js";

export type Command = {
	execute(interaction: ChatInputCommandInteraction<CacheType>): unknown;
    name: string;
    description: string;
    data: any;
}

interface Player {
    name: string;
    id: string;
    mmr: number;
    role: string | null;
    team_num: number;
    top_role_index: number;
    ign: string | null;
    timestamp: string;
    pulled_from: string | null;
    team_name: string | null;
    party_leader: string | null;
    captain: string | null;
    picked: boolean;
    mmr_change: number;
    priority: number;
    guild_id: string;
    mmr_multiplier: number;
    points_multiplier: number;
    tournament_team_id: string | null;
    queue_entry_survey: {
      Deck: {
        value: string;
        visible: boolean;
      };
    };
  }
  
type Team = Player[][];
  
export interface MatchesResponse {
[key: string]: {
    players: Player[];
    teams: Team[];
    channel_id: string;
};
}

export type Bans = Ban[]

export interface Ban {
  name: string
  id: string
  banned_until: number
  reason?: string
}


import { SlashCommandBuilder, Collection, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"
import { YouTubeStream } from "play-dl"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}

export interface YTVideo {
    name: string,
    url: string,
    stream?: YouTubeStream,
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
    }
}

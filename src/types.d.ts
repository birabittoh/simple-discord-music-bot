import { SlashCommandBuilder, Collection, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
    }
}

import { BaseCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    exp?: number;
    ephemeral?: boolean;
    noDefer?: boolean
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}
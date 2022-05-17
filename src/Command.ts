import { BaseCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    exp?: number;
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}
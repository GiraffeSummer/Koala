import { BaseCommandInteraction, ChatInputApplicationCommandData, BaseApplicationCommandData, Client, ApplicationCommandType } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    name: string;
    exp?: number;
    ephemeral?: boolean;
    noDefer?: boolean;
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}

export interface ContextCommand extends BaseApplicationCommandData {
    name: string;
    ephemeral?: boolean;
    noDefer?: boolean;
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}


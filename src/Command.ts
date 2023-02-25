import { CommandInteraction, ChatInputApplicationCommandData, BaseApplicationCommandData, Client, ApplicationCommandType } from "discord.js";
import { ButtonInteractionListener as ButtonHandler } from './lib/ButtonInteractionListener'
export interface Command extends ChatInputApplicationCommandData {
    name: string;
    exp?: number;
    ephemeral?: boolean;
    noDefer?: boolean;
    run: (client: Client, interaction: CommandInteraction) => void;
    buttonHandler?: ButtonHandler;
}

export interface ContextCommand extends BaseApplicationCommandData {
    name: string;
    ephemeral?: boolean;
    noDefer?: boolean;
    run: (client: Client, interaction: CommandInteraction) => void;
}


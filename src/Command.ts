import { CommandInteraction, AutocompleteInteraction, ChatInputApplicationCommandData, BaseApplicationCommandData, Client, ApplicationCommandType } from "discord.js";
import { ButtonInteractionListener as ButtonHandler } from './lib/ButtonInteractionListener'
export interface Command extends ChatInputApplicationCommandData {
    name: string;
    exp?: number;
    ephemeral?: boolean;
    noDefer?: boolean;
    run: (client: Client, interaction: CommandInteraction) => void;
    getAutoCompleteOptions?: (client: Client, interaction: AutocompleteInteraction, query: string) => Promise<{ value: string, name: string }[]>;
    buttonHandler?: ButtonHandler;
    nsfw?: boolean;
    disabled?: boolean;
}

export interface ContextCommand extends BaseApplicationCommandData {
    name: string;
    ephemeral?: boolean;
    noDefer?: boolean;
    disabled?: boolean;
    run: (client: Client, interaction: CommandInteraction) => void;
}


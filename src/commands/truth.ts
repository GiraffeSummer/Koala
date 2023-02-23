import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { InitializeMessage } from '../lib/TruthOrDare';

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "truth",
    description: "TRUTH or dare",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        await InitializeMessage(interaction, 'truth');
    }
} as Command;
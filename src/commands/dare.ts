import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { InitializeMessage } from '../lib/TruthOrDare';

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "dare",
    description: "truth or DARE",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        await InitializeMessage(interaction, 'dare');
    }
} as Command;
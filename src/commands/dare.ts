import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import theme from "../lib/theme";
import { getDare, addButtons } from "../lib/TruthOrDare"

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "dare",
    description: "truth or DARE",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const question = await getDare();

        await interaction.followUp({
            embeds: [{ description: question, color: theme.default }],
            // components: [await addButtons(client, interaction, question,)]
        });
    }
} as Command;
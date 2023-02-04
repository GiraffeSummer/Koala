import { CommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import theme from "../lib/theme";
import { getTruth, addButtons } from "../lib/TruthOrDare"

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "truth",
    description: "TRUTH or dare",
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        const question = await getTruth();

        interaction.deleteReply();
        const msg = await interaction.channel.send({
            embeds: [{ description: question, color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() } }],
        });
        msg.edit({ components: [await addButtons(client, msg, question,)] })
    }
} as Command;
import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "support",
    description: "Support Hikage",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const botName = client.user.username

        const embed = new Embed('Support').setColor('4169e1')
            .setDescription(`Thank you for being interested in supporting ${botName}!\n
        To support ${botName} check out my [Patreon](https://patreon.com/HikageBot) \nor contact the developer: <@151039550234296320>\n
        And feel free to join the [support server](https://discord.gg/DQCs8yU)`)

        await interaction.followUp({
            ephemeral: true,
            embeds: embed.get()
        });
    }
} as Command;
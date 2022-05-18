import { BaseCommandInteraction, Client, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "support",
    description: "Support Hikage",
    type: "CHAT_INPUT",
    ephemeral: true,
    exp: 2,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const botName =
            await interaction.followUp({
                //embeds: [{ description: `[invite](${getInvite(client.user.id)})` }]
                content: `Thank you for being interested in supporting ${client.user.username}!\nContact the developer: <@151039550234296320>\nOr click the links below:`,
                components: [new MessageActionRow()
                    .addComponents(
                        CreateLink('https://patreon.com/HikageBot', 'Patreon'),
                        CreateLink('https://discord.gg/DQCs8yU', 'Support server')
                    )]
            });

        /*
    const embed = new Embed('Support').setColor('4169e1')
        .setDescription(`
    To support ${botName} check out my [Patreon](https://patreon.com/HikageBot) \nor contact the developer: <@151039550234296320>\n
    And feel free to join the [support server](https://discord.gg/DQCs8yU)`)

    await interaction.followUp({
        ephemeral: true,
        embeds: embed.get()
    });
    */
    }
} as Command;

function CreateLink(url: string, text: string): MessageButton {
    return new MessageButton()
        .setURL(url)
        .setLabel(text)
        .setStyle("LINK")
}
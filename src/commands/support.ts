import { BaseCommandInteraction, Client, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../src/Command";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "support",
    description: "Support Hikage",
    type: "CHAT_INPUT",
    ephemeral: true,
    exp: 2,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            //embeds: [{ description: `[invite](${getInvite(client.user.id)})` }]
            content: `Thank you for being interested in supporting ${client.user.username}!\nContact the developer: <@151039550234296320>\nOr click the links below:`,
            components: [new MessageActionRow()
                .addComponents(
                    CreateLink('https://patreon.com/HikageBot', 'Patreon'),
                    CreateLink('https://discord.gg/DQCs8yU', 'Support server')
                )]
        });
    }
} as Command;

function CreateLink(url: string, text: string): MessageButton {
    return new MessageButton()
        .setURL(url)
        .setLabel(text)
        .setStyle("LINK")
}
import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "support",
    description: "Support Hikage",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    exp: 2,
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.followUp({
            //embeds: [{ description: `[invite](${getInvite(client.user.id)})` }]
            content: `Thank you for being interested in supporting ${client.user.username}!\nContact the developer: <@151039550234296320>\nOr click the links below:`,
            components: [new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    CreateLink('https://patreon.com/HikageBot', 'Patreon'),
                    CreateLink('https://discord.gg/DQCs8yU', 'Support server')
                )]
        });
    }
} as Command;

function CreateLink(url: string, text: string): ButtonBuilder {
    return new ButtonBuilder()
        .setURL(url)
        .setLabel(text)
        .setStyle(ButtonStyle.Link)
}
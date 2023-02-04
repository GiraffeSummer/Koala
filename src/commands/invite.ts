const getInvite = (id: string) => {
    //533314530369
    return `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=516000369729&scope=bot%20applications.commands`
}
import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "invite",
    description: "Invite the bot to your own server",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.followUp({
            //embeds: [{ description: `[invite](${getInvite(client.user.id)})` }]
            content: `Invite <@${client.user.id}> into your own server.`,
            components: [new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setURL(getInvite(client.user.id))
                        .setLabel('Invite')
                        .setStyle(ButtonStyle.Link),

                )]
        });
    }
} as Command;
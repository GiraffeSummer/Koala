const getInvite = (id: string) => {
    return `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=516000369729&scope=bot%20applications.commands`
}
import { BaseCommandInteraction, Client, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../src/Command";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "invite",
    description: "Invite the bot to your own server",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            //embeds: [{ description: `[invite](${getInvite(client.user.id)})` }]
            content: `Invite <@${client.user.id}> into your own server.`,
            components: [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setURL(getInvite(client.user.id))
                        .setLabel('Invite')
                        .setStyle("LINK"),

                )]
        });
    }
} as Command;
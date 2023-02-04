import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../src/Command";
import theme from "../lib/theme";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "avatar",
    description: "Get someone's avatar",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'Which user'
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;
        const avatarUrl = user.avatarURL()

        await interaction.followUp({
            embeds: [{ title: user.username, image: { url: avatarUrl }, color: theme.default }]
        });
    }
} as Command;

function getUserAvatar(avatar: string, userid: string, discriminator: number): string {
    if (avatar === undefined) {
        const index = discriminator % 5;
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`
    } else {
        const animated = avatar.startsWith('a_');
        return `https://cdn.discordapp.com/avatars/${userid}/${avatar}.${(animated) ? 'gif' : 'png'}`;
    }
}
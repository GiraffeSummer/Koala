import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "avatar",
    description: "Get someone's avatar",
    type: "CHAT_INPUT",
    options: [{
        type: 'USER',
        name: 'user',
        description: 'Which user'
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;
        const avatarUrl = user.displayAvatarURL({ dynamic: true })

        const embed = new Embed(user.username).setImage(avatarUrl).setColor('4169e1')

        await interaction.followUp({
            ephemeral: true,
            embeds: embed.get()
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
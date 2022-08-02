import { BaseCommandInteraction, Client } from "discord.js";
import { ApplicationCommandTypes } from "discord.js/typings/enums";
import { ContextCommand } from "../Command";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "avatar",
    type: ApplicationCommandTypes.USER,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;
        const avatarUrl = user.displayAvatarURL({ dynamic: true })

        const embed = new Embed(user.username).setImage(avatarUrl).setColor('4169e1')

        await interaction.followUp({
            embeds: embed.get()
        });
    }
} as ContextCommand;
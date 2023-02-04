import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import theme from '../lib/theme'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "lvltop",
    description: "Get the top highest levels",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const top = await prisma.user.findMany({ take: 10, orderBy: [{ lvl: 'desc' }, { toLvl: 'asc' }] });

        const embed = { title: "Top 10:", color: theme.default, fields: [] };

        for (let i = 0; i < top.length; i++) {
            const usr = top[i];
            embed.fields.push({ name: `**#${i + 1}** ${usr.name}#${usr.discriminator}`, value: `Level: ${usr.lvl} with ${usr.toLvl} to go.`, inline: true })
        }
        await interaction.followUp({
            embeds: [embed]
        });
    }
} as Command;
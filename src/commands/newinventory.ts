import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import theme from '../lib/theme'
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Paginator from '../lib/ButtonPagination'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "newinventory",
    description: "Get your inventory",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'Which user'
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user);
        const profile = await prisma.user.findFirst({ where: { uid: user.id }, include: { items: { include: { item: true } } } })

        if (profile.items.length == 0) {
            return await interaction.followUp({ content: `<@${user.id}> has no items.` })
        }

        const itemsPerPage = 9

        const paginator = new Paginator(interaction, profile.items.length / itemsPerPage)
        paginator.showPageNumber = true;
        paginator.timeoutSeconds = 30;

        paginator.init(
            (page) => {
                const embed = {
                    title: `${user.username}'s Inventory.`,
                    color: user.accentColor || theme.default,
                    fields: Paginator.paginateArray(profile.items, page, itemsPerPage)
                        .map(it => {
                            return { name: it.item.symbol, value: `**${it.item.name}** ${(it.amount > 1) ? `*x*` + it.amount : ''}`, inline: true }
                        })
                }
                return {
                    embeds: [embed]
                }
            })
    }
} as Command;
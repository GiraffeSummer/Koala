import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, TextChannel, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Paginator from '../lib/ButtonPagination'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "throw",
    description: "Throw an item to someone",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'Which user',
            required: true
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        const profile = await prisma.user.findFirst({ where: { uid: interaction.user.id }, include: { items: { include: { item: true } } } })

        if (profile.items.length == 0) {
            return await interaction.followUp({ content: `You have no items.` })
        }

        const paginator = new Paginator(interaction, profile.items.length / 5)
        paginator.showPageNumber = true;
        paginator.timeoutSeconds = 120;

        paginator.customCollect = async (i) => {
            const itemName = i.customId.substring('throwpick_'.length);
            const { item, amount } = profile.items.find((it) => `${it.itemid}` == itemName);
            if (amount > 1) {
                await prisma.item_inventory.upsert({
                    where: {
                        userid_itemid: { userid: interaction.user.id, itemid: item.id }
                    },
                    create: {
                        userid: interaction.user.id,
                        itemid: item.id
                    },
                    update: {
                        amount: { decrement: 1 }
                    }
                })
            } else {
                await prisma.item_inventory.delete({
                    where: { userid_itemid: { userid: interaction.user.id, itemid: item.id } }
                })
            }
            await interaction.editReply({ components: [], content: `You threw a: ${item.symbol} ${item.name} at ${user}` })
            if (!user.bot)
                user.send({ content: `${interaction.user} threw a ${item.symbol} ${item.name} at you. That hurt!` })

            i.update({ components: [] })
        };

        paginator.init((page) => {
            const row = new ActionRowBuilder<ButtonBuilder>();
            const subList = Paginator.paginateArray(profile.items, page, 5);
            for (let i = 0; i < subList.length; i++) {
                const { item, amount } = subList[i];
                const itemId = 'throwpick_' + item.id
                row.addComponents(new ButtonBuilder()
                    .setCustomId(itemId)
                    .setEmoji(item.symbol)
                    .setLabel(`${item.name} ${(amount > 1) ? `(` + amount + "x)" : ''}`)
                    .setStyle(ButtonStyle.Primary))
            }
            return {
                content: `What would you like to throw at ${user}`,
                components: [row]
            }
        })
    }
} as Command;
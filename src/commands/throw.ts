import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Command } from "../../src/Command";
import Prisma from '@prisma/client';
import prisma, { where, FindOrCreateUser } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "throw",
    description: "Throw an item to someone",
    type: "CHAT_INPUT",
    ephemeral: true,
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'Which user',
            required: true
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        const profile = await prisma.user.findFirst({ where: { uid: interaction.user.id }, include: { items: { include: { item: true } } } })

        if (profile.items.length == 0) {
            return await interaction.followUp({ content: `You have no items.` })
        }

        const rowNum = (profile.items.length > 5) ? profile.items.length / 5 : 1;
        let rows = []
        let itemMap = {}

        for (let r = 0; r < rowNum; r++) {
            const row = new MessageActionRow();
            const subList = profile.items.slice().splice(r * 5, 5)
            for (let i = 0; i < subList.length; i++) {
                const { item, amount } = subList[i];
                const itemId = 'itempick_' + item.id
                itemMap[itemId] = { item, amount }
                row.addComponents(new MessageButton()
                    .setCustomId(itemId)
                    .setEmoji(item.symbol)
                    .setLabel(`${item.name} ${(amount > 1) ? `(` + amount + "x)" : ''}`)
                    .setStyle("PRIMARY"))
            }
            rows.push(row)
        }

        await interaction.followUp({
            content: `What would you like to throw at ${user}`,
            components: rows
        });

        const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
        const collector = channel.createMessageComponentCollector({
            filter: (int) => interaction.user.id === int.user.id,
            componentType: "BUTTON",
            max: 1,
            time: 300 * 1000
        })


        collector.on('end', async (collection) => {
            collection.forEach(async click => {
                if (!Object.keys(itemMap).includes(click.customId)) return
                const { item, amount }: {
                    item: Prisma.Item, amount: number
                } = itemMap[click.customId]

                if (amount > 1) {
                    await prisma.item_inventory.upsert({
                        where: {
                            userid_itemid: { userid: interaction.user.id, itemid: item.id }
                        },
                        create: {
                            userid: interaction.user.id,
                            itemid: item.id,
                            amount: 1
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
                user.send({ content: `${interaction.user} threw a ${item.symbol} ${item.name} at you. That hurt!` })

                //add item to user's inventory (chance?)
            })
        })
    }
} as Command;
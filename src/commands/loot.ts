import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Prisma from '@prisma/client';
import { RandomNum } from "../lib/Functions";

const pickAmount = 5;

const timeAmount = 30 * 60 * 1000

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "loot",
    description: "Loot some items",
    type: "CHAT_INPUT",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const profile = await FindOrCreateUser(interaction.user);

        const timeDif = new Date().getTime() - profile.lootTimer.getTime()
        if (timeAmount > timeDif) {
            return await interaction.followUp({ ephemeral: true, components: [], content: "Wait a little longer!" })
        }

        let picked = await PickItems()

        const allowedIds = []
        const row = new MessageActionRow();
        for (let i = 0; i < picked.length; i++) {
            const item = picked[i];
            const itemId = 'itempick_' + item.id
            allowedIds[itemId] = item.id
            row.addComponents(new MessageButton()
                .setCustomId(itemId)
                .setEmoji(item.symbol)
                .setLabel(item.name)
                .setStyle("PRIMARY"))
        }

        const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
        const collector = channel.createMessageComponentCollector({
            filter: (int) => interaction.user.id === int.user.id,
            componentType: "BUTTON",
            max: 1,
            time: 300 * 1000
        })

        await interaction.followUp({ ephemeral: true, content: "Please pick one item", components: [row] })

        //use collect if I wanna pick more, then on end add picked ones
        //on collect -> add to list; on end -> add list to inventory

        collector.on('end', async (collection) => {
            collection.forEach(async click => {
                if (!Object.keys(allowedIds).includes(click.customId)) return
                const item: Prisma.Item = picked.find(x => x.id == allowedIds[click.customId])

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
                        amount: { increment: 1 }
                    }
                })
                await prisma.user.update({ where: { uid: interaction.user.id }, data: { lootTimer: new Date() } })
                await interaction.editReply({ components: [], content: `You picked: ${item.symbol} ${item.name}` })
            })
        })

    }
} as Command;

async function PickItems(amount: number = pickAmount) {
    let all = await prisma.item.findMany();
    let out = []
    for (let i = 0; i < amount; i++) {
        let choice = all[RandomNum(all.length - 1)]
        if (out.includes(choice))
            i--;
        else
            out.push(choice)
    }
    return out;
}
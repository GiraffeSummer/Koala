import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "inventory",
    description: "Get your inventory",
    type: "CHAT_INPUT",
    ephemeral: true,
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'Which user'
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user);
        const profile = await prisma.user.findFirst({ where: { uid: user.id }, include: { items: { include: { item: true } } } })

        if (profile.items.length == 0) {
            return await interaction.followUp({ content: `<@${user.id}> has no items.` })
        }

        const embed = new Embed(`${user.username}'s Inventory.`)
            .setColorRaw(user.accentColor);

        for (let i = 0; i < profile.items.length; i++) {
            const { item, amount } = profile.items[i];
            if (i >= 24) break;
            embed.addField(item.symbol, `**${item.name}** ${(amount > 1) ? `*x*` + amount : ''}`)
        }

        await interaction.followUp({
            embeds: embed.get()
        });
    }
} as Command;
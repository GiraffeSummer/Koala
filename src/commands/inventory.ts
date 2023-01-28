import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import theme from "../lib/theme";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "inventory",
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

        const embed = {
            title: `${user.username}'s Inventory.`,
            color: user.accentColor || theme.default,
            fields: []
        }

        for (let i = 0; i < profile.items.length; i++) {
            const { item, amount } = profile.items[i];
            if (i >= 24) break;
            embed.fields.push({ name: item.symbol, value: `**${item.name}** ${(amount > 1) ? `*x*` + amount : ''}`, inline: true })
        }

        await interaction.followUp({
            embeds: [embed]
        });
    }
} as Command;
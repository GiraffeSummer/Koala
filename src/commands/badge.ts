import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "badge",
    description: "badge commands",
    type: "CHAT_INPUT",
    options: [{
        type: 'SUB_COMMAND',
        name: 'list',
        description: 'List all badges',
        options: [{
            type: 'USER',
            name: 'user',
            description: 'user to list',
        }]
    },
    {
        type: 'SUB_COMMAND',
        name: 'current',
        description: 'get current badge',
        options: [{
            type: 'USER',
            name: 'user',
            description: 'user to list'
        }]
    },
    {
        type: 'SUB_COMMAND',
        name: 'select',
        description: 'set selected badge',
        options: [{
            type: 'STRING',
            name: 'badge',
            description: 'badge name',
            required: true
        }],
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const sub = interaction.options['_subcommand']
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user)

        const profile = await prisma.user.findFirst({
            where: { uid: user.id },
            include: { Badge: true, badges: { include: { badge: true } } }
        });

        switch (sub) {
            case 'current':
                if (profile.selectedBadge) {
                    return await interaction.editReply({
                        embeds: [{
                            title: `Selected badge: **${profile.Badge.name}**`,
                            description: `Selected badge: *${profile.Badge.description}*\n${profile.Badge.badge}`
                        }]
                    });
                } else return await interaction.followUp({
                    ephemeral: true,
                    embeds: [{ description: `You do not have a badge selected.` }]
                });
                break;
            case 'list':
                let text = []
                for (let i = 0; i < profile.badges.length; i++) {
                    const badge = profile.badges[i].badge;
                    text.push(`${badge.badge} > ${badge.name} `)
                }
                return await interaction.editReply({
                    embeds: [{ description: text.join('\n') }]
                });
                break;

            case 'select':
                //maybe make dropdown menu?
                const badgeName = interaction.options.get('badge')?.value as string;
                const attemptBadge = await prisma.badge.findFirst(where({ name: badgeName }));
                if (attemptBadge) {
                    const index = profile.badges.findIndex(x => x.badgeid === attemptBadge.id)
                    if (index >= 0) {
                        await prisma.user.update({ where: { uid: interaction.user.id }, data: { selectedBadge: attemptBadge.id } })
                        return await interaction.followUp({
                            ephemeral: true,
                            embeds: [{ description: `Equipped badge \`${badgeName}\`.` }]
                        });
                    } else return await interaction.followUp({
                        ephemeral: true,
                        embeds: [{ description: `You do not have \`${badgeName}\` badge.` }]
                    });
                }
                else return await interaction.followUp({
                    ephemeral: true,
                    embeds: [{ description: `badge \`${badgeName}\` not found` }]
                });
                break;
            default:
                break;
        }


    }
} as Command;
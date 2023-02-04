import {
    CommandInteraction, Client, ActionRowBuilder, StringSelectMenuBuilder, TextChannel,
    ComponentType,
    ApplicationCommandType,
    ApplicationCommandOptionType
} from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "badge",
    description: "badge commands",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [{
        type: ApplicationCommandOptionType.Subcommand,
        name: 'list',
        description: 'List all badges',
        options: [{
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'user to list',
        }]
    },
    {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'current',
        description: 'get current badge',
        options: [{
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'user to list'
        }]
    },
    {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'select',
        description: 'set selected badge',
        //choices: [],
        //options: [{ type: 'STRING', name: 'badge', description: 'badge name', required: true }],
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const sub = interaction.options['_subcommand']
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user)

        const profile = await prisma.user.findFirst({
            where: { uid: user.id },
            include: { Badge: true, badges: { include: { badge: true } } }
        });

        if (profile.badges.length <= 0) {
            return await interaction.followUp({
                ephemeral: true,
                embeds: [{ description: `You do not have any badges. 😔` }]
            });
        }

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
                const options = profile.badges.map((badge, i) => { return { label: badge.badge.name, emoji: badge.badge.badge, value: `${i}`, description: badge.badge.description } });
                const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_badge')
                            .setPlaceholder('None')
                            .addOptions(options),
                    );

                const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
                const collector = channel.createMessageComponentCollector({
                    filter: (int) => {
                        return user.id === int.user.id;
                    },
                    componentType: ComponentType.StringSelect,
                    max: 1,
                    time: 300 * 1000
                })

                collector.on('end', async (collection) => {
                    collection.forEach(async click => {
                        if (click.customId == `select_badge`) {
                            const newBadge = profile.badges[click.values[0]].badge;
                            await prisma.user.update({ where: { uid: interaction.user.id }, data: { selectedBadge: newBadge.id } });
                            await interaction.editReply({ content: `You selected badge: ${newBadge.badge} ${newBadge.name}!`, components: [] });
                        }
                    })
                })

                await interaction.followUp({ ephemeral: true, content: 'Pick a badge!', components: [row] });
                break;
            default:
                break;
        }


    }
} as Command;
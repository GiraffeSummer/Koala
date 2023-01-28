import { CommandInteraction, Client, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, TextChannel, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "pronouns",
    description: "badge commands",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'set',
            description: 'Choose your pronouns',
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'remove',
            description: 'Remove a pronoun',
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'get',
            description: 'Get someone\'s pronouns',
            options: [{
                type: ApplicationCommandOptionType.User,
                name: 'user',
                description: 'who\'s?',
            },]
        }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const sub = interaction.options['_subcommand']
        const user = interaction.options.get('user')?.user || interaction.user;

        const pronouns = await prisma.pronouns.findMany({});

        await FindOrCreateUser(user)

        const profile = await prisma.user.findFirst({
            where: { uid: user.id },
            include: { pronouns: { include: { pronouns: true } } }
        });

        const unUsedPronouns = pronouns.filter(p =>
            !profile.pronouns.some(x => x.pronouns.id == p.id)
        );

        switch (sub) {
            case 'remove':
                const usedPronouns = pronouns.filter(p =>
                    profile.pronouns.some(x => x.pronouns.id == p.id)
                );
                if (usedPronouns.length > 0) {
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('remove_pronouns')
                                .setPlaceholder('None')
                                .addOptions(usedPronouns.map(
                                    (pronoun, i) => { return { label: pronoun.name, value: `${pronoun.id}`, emoji: pronoun.emoji, description: pronoun.name } }
                                )),
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
                            if (click.customId == `remove_pronouns`) {
                                const pronoun = pronouns.find(x => x.id == parseInt(click.values[0]));
                                await prisma.pronoun_list.delete({ where: { userid_pronounId: { userid: interaction.user.id, pronounId: parseInt(click.values[0]) } } });
                                await interaction.editReply({ content: `You removed: ${pronoun.name}!`, components: [] });
                            }
                        })
                    })

                    return await interaction.followUp({ ephemeral: true, content: 'Remove a pronoun!', components: [row] });
                } else return await interaction.followUp({ ephemeral: true, content: `You have not selected any pronouns yet` });
                break;
            case 'get':
                const pronounsText = (profile.pronouns.length > 0) ? profile.pronouns.map(x => x.pronouns.name).join(', ') : 'Has not selected any pronouns';
                await interaction.followUp({ ephemeral: true, embeds: [{ title: `${user.username}`, description: `${pronounsText}` }] });
                break;
            case 'set':
                const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_pronouns')
                            .setPlaceholder('None')
                            .addOptions(unUsedPronouns.map(
                                (pronoun, i) => { return { label: pronoun.name, value: `${pronoun.id}`, emoji: pronoun.emoji, description: pronoun.name } }
                            )),
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
                        if (click.customId == `select_pronouns`) {
                            const pronoun = pronouns.find(x => x.id == parseInt(click.values[0]))
                            await prisma.pronoun_list.create({ data: { userid: interaction.user.id, pronounId: parseInt(click.values[0]) } });
                            await interaction.editReply({ content: `You selected: ${pronoun.emoji} ${pronoun.name}!`, components: [] });
                        }
                    })
                })

                await interaction.followUp({ ephemeral: true, content: 'Pick your pronouns!', components: [row] });
                break;
            default:
                break;
        }


    }
} as Command;
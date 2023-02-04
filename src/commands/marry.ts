import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, TextChannel, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import { addExpInteraction } from '../lib/LevelSystem'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "marry",
    description: "Marry someone",
    type: ApplicationCommandType.ChatInput,
    exp: 2,
    options: [{
        type: ApplicationCommandOptionType.User,
        name: 'user',
        description: 'Which user',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = interaction.options.get('user')?.user;
        if (user.id === interaction.user.id) return await interaction.followUp({ content: "You cannot marry yourself!", ephemeral: true })

        const profile = await FindOrCreateUser(interaction.user);
        const partner = await FindOrCreateUser(user);

        if (profile.married == true || partner.married == true) {
            return await interaction.editReply({ content: `${profile.married ? '**You** are' : '**' + user.username + '**'} already married!` })
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('marry_yes')
                    .setEmoji('💍')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('marry_no')
                    .setEmoji('💔')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.editReply({
            content: `${user}`,
            embeds: [{
                color: 0xffb6c1,
                description: `${user}, do you take ${interaction.user} to be your lawfully wedded partner?`,
                footer: { text: interaction.user.username, icon_url: interaction.user.avatarURL() }
            }],
            components: [row]
        })

        const filter = (btnInteraction) => {
            return user.id === btnInteraction.user.id || interaction.user.id === '151039550234296320';
        }

        const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
        const collector = channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            max: 1,
            time: 300 * 1000
        })

        collector.on('end', async (collection) => {
            collection.forEach(async click => {
                switch (click.customId) {
                    case 'marry_yes':
                        const allGood = true;
                        if (allGood) {
                            await prisma.user.update({ where: { uid: interaction.user.id }, data: { partnerId: user.id, married: true } });
                            await prisma.user.update({ where: { uid: user.id }, data: { partnerId: interaction.user.id, married: true } });

                            await interaction.editReply({
                                components: []
                            })
                            await interaction.followUp({
                                embeds: [{ color: 0xffb6c1, description: `:tada: CONGRATULATIONS! :tada:\n <@${partner.uid}>,  got married with <@${profile.uid}> :ring:!`, }],
                            })

                            await addExpInteraction(interaction, 1, user);
                        }
                        break;
                    case 'marry_no':
                    default:
                        interaction.editReply({
                            content: `You did not get married to ${user.username} 💔`,
                            embeds: [],
                            components: []
                        })
                        break;
                }

            })
        })

    }
} as Command;
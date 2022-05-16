import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, TextChannel } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "marry",
    description: "Marry someone",
    type: "CHAT_INPUT",
    options: [{
        type: 'USER',
        name: 'user',
        description: 'Which user',
        required: true
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user;
        if (user.id === interaction.user.id) return await interaction.followUp({ content: "You cannot marry yourself!", ephemeral: true })

        const profile = await FindOrCreateUser(interaction.user);
        const partner = await FindOrCreateUser(user);

        if (profile.married == true || partner.married == true) {
            return await interaction.editReply({ content: `${profile.married ? '**You** are' : '**' + user.username + '**'} already married!` })
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('marry_yes')
                    .setEmoji('💍')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('marry_no')
                    .setEmoji('💔')
                    .setLabel('No')
                    .setStyle('DANGER')
            );

        const embed = new Embed().setColor('ffb6c1')
            .setDescription(`${user}, do you take ${interaction.user} to be your lawfully wedded partner?`)
            .setFooter(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))

        await interaction.editReply({
            content: `${user}`,
            embeds: embed.get(),
            components: [row]
        })

        const filter = (btnInteraction) => {
            return user.id === btnInteraction.user.id || interaction.user.id === '151039550234296320';
        }

        const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
        const collector = channel.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
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
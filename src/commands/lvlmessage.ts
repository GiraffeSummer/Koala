import { CommandInteraction, Client, ActionRowBuilder, StringSelectMenuBuilder, TextChannel, PermissionFlagsBits, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "lvlmessage",
    description: "Change levelmessage settings",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
    options: [{
        type: ApplicationCommandOptionType.Subcommand,
        name: 'channel',
        description: 'Change the channel level messages are sent in (blank to reset)',
        options: [{
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            description: 'channel to send level messages in',
        }],
    },
    {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'toggle',
        description: 'toggle messages on or off',
        options: [{
            type: ApplicationCommandOptionType.Boolean,
            name: 'enable',
            description: 'enable level messages?',
            required: true
        }]
    },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        //const user = interaction.options.get('user')?.user || interaction.user;
        const sub = interaction.options['_subcommand'];


        switch (sub) {
            case 'toggle':
                const enable: boolean = interaction.options.get('enable').value == true;
                await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlmessages: enable } });
                interaction.followUp({ content: `Switched level messages: ${enable ? 'on' : 'off'}` })
                break;

            case 'channel':
                const chosenChannel = interaction.options.get('channel')?.channel;
                const channel = await client.channels.fetch(chosenChannel.id);
                if (chosenChannel == undefined) {
                    await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlChannel: null } });
                    interaction.followUp({ content: `Reset level messages channel` })
                } else {
                    if (!channel.isTextBased()) {
                        return interaction.followUp({ content: `Channel needs to be a text channel.`, ephemeral: true })
                    }
                    await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlChannel: chosenChannel.id } });
                    interaction.followUp({ content: `Sending level messages in: ${chosenChannel}` })
                }
                break;

            default:
                break;
        }
    }
} as Command;
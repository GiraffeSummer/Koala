import { BaseCommandInteraction, Client, MessageActionRow, MessageSelectMenu, TextChannel } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "lvlmessage",
    description: "Change levelmessage settings",
    type: "CHAT_INPUT",
    ephemeral: true,
    defaultMemberPermissions: ["MANAGE_GUILD"],
    options: [{
        type: 'SUB_COMMAND',
        name: 'channel',
        description: 'Change the channel level messages are sent in (blank to reset)',
        options: [{
            type: 'CHANNEL',
            name: 'channel',
            description: 'channel to send level messages in',
        }],
    },
    {
        type: 'SUB_COMMAND',
        name: 'toggle',
        description: 'toggle messages on or off',
        options: [{
            type: 'BOOLEAN',
            name: 'enable',
            description: 'enable level messages?',
            required: true
        }]
    },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        //const user = interaction.options.get('user')?.user || interaction.user;
        const sub = interaction.options['_subcommand'];


        switch (sub) {
            case 'toggle':
                const enable: boolean = interaction.options.get('enable').value == true;
                await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlmessages: enable } });
                interaction.followUp({ content: `Switched level messages: ${enable ? 'on' : 'off'}` })
                break;

            case 'channel':
                const channel = interaction.options.get('channel')?.channel;
                if (channel == undefined) {
                    await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlChannel: null } });
                    interaction.followUp({ content: `Reset level messages channel` })
                } else {
                    if (!["GUILD_TEXT"].includes(channel?.type.toString())) {
                        return interaction.followUp({ content: `Channel needs to be a text channel.`, ephemeral: true })
                    }
                    await prisma.guild.update({ where: { id: interaction.guildId }, data: { lvlChannel: channel.id } });
                    interaction.followUp({ content: `Sending level messages in: ${channel}` })
                }
                break;

            default:
                break;
        }
    }
} as Command;
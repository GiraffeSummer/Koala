import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import fetch from '../lib/fetch'
import theme from "../lib/theme";

export default {
    name: "horoscope",
    description: "get your horoscope",
    type: ApplicationCommandType.ChatInput,
    //ephemeral: true,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'sign',
        required: true,
        description: 'your starsign',
        choices: [
            {
                name: 'aquarius',
                value: 'aquarius'
            },
            {
                name: 'pisces',
                value: 'pisces'
            },
            {
                name: 'aries',
                value: 'aries'
            },
            {
                name: 'taurus',
                value: 'taurus'
            },
            {
                name: 'gemini',
                value: 'gemini'
            },
            {
                name: 'cancer',
                value: 'cancer'
            },
            {
                name: 'leo',
                value: 'leo'
            },
            {
                name: 'virgo',
                value: 'virgo'
            },
            {
                name: 'libra',
                value: 'libra'
            },
            {
                name: 'scorpio',
                value: 'scorpio'
            },
            {
                name: 'sagittarius',
                value: 'sagittarius'
            },
            {
                name: 'capricorn',
                value: 'capricorn'
            }
        ],
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const sign: string = interaction.options.get('sign').value as string;
        const baseUrl = 'https://ohmanda.com/api/horoscope/'
        const body: any = (await fetch(baseUrl + sign)).data

        await interaction.followUp({
            ephemeral: true,
            embeds: [
                {
                    title: `${body.sign}`,
                    description: `${body.horoscope}`,
                    color: theme.default,
                    footer: {
                        text: `${body.date}`
                    },
                }
            ]
        });
    }
} as Command;
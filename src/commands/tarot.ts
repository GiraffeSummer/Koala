import { BaseCommandInteraction, Client, MessageAttachment } from "discord.js";
import { Command } from "../../src/Command";
import Tarot, { Card, Suits, CardType } from '../lib/Tarot/Tarot';
import theme from "../lib/theme";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "tarot",
    description: "do a tarot reading",
    type: "CHAT_INPUT",
    ephemeral: true,
    options: [{
        type: 'NUMBER',
        name: 'set',
        description: 'How many sides should the dice have?',
        choices: [
            { name: 'All', value: 0 },
            { name: 'Major', value: 1 },
            { name: 'Minor', value: 2 }
        ]
        //{ type: 'STRING', name: 'deck', description: 'which deck to use', choices: [ { name: 'rock', value: 'rock' },{ name: 'paper', value: 'paper' }, { name: 'scissors', value: 'scissors' } ], } 
    },
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const type: CardType = interaction.options.get('set')?.value as CardType || CardType.All;
        const card = await Tarot(type);

        const embeds = [{
            title: card.name,
            description: card.fortune_telling.random(),
            fields: [
                { name: 'Light:', value: card.meanings.light.random() },
                { name: 'Shadow:', value: card.meanings.shadow.random() },
                { name: 'Keywords:', value: card.keywords.join(', ') },
            ],
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL({ dynamic: true })
            },
            image: { url: `attachment://tarot.png` },
            color: theme.default,
        }]

        await interaction.followUp({
            embeds, files: [new MessageAttachment(card.image, `tarot.png`)]
        });
    }
} as Command;
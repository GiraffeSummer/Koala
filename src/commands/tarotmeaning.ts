import { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import Tarot, { Card, Suits, CardType, defaultDeckName } from '../lib/Tarot/Tarot';
import { type Deck, decks, tryDeck } from '../lib/Tarot/Decks';
import tarotInterpertation from '../lib/Tarot/interpretation';
import theme from "../lib/theme";
import ollama from "../lib/ollama";
import { generatePrompt } from "../lib/Tarot/generatePrompt";
const cardNames = tarotInterpertation.map(x => x.name)

export default {
    name: "tarotmeaning",
    description: "get the meaning of a tarot card",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'card',
        description: 'What kind of reading do you want to',
        autocomplete: true,
        required: true
    },
    {
        type: ApplicationCommandOptionType.String,
        name: 'deck',
        description: 'Which deck images to use?',
        choices: Object.keys(decks).map(key => { return { value: key, name: decks[key].name } }),
    },
    {
        type: ApplicationCommandOptionType.String,
        name: 'reading_style',
        description: 'How detailed should the card reading be?',
        choices: [
            { name: 'Simple', value: 'simple' },
            { name: 'Interpreted', value: 'interpreted' },
        ],
    },
    ],
    getAutoCompleteOptions: async (client: Client, interaction: CommandInteraction, query: string) => {
        let options = cardNames.filter(choice => choice.toLowerCase().includes(query.toLowerCase()));

        return options.map(choice => { return { name: choice, value: choice } })
    },
    run: async (client: Client, interaction: CommandInteraction) => {
        const cardName: string = interaction.options.get('card')?.value as string
        const deckName: string = interaction.options.get('deck')?.value as string || defaultDeckName
        const reading_style: string = interaction.options.get('reading_style')?.value as string || 'simple'
        const card = tarotInterpertation.find(x => x.name == cardName);

        let deck: Deck = tryDeck(deckName);

        const embeds = [reading_style == 'simple' ? {
            title: card.name,
            description: card.fortune_telling.join('; '),
            fields: [
                { name: 'Light:', value: card.meanings.light.join('; ') },
                { name: 'Shadow:', value: card.meanings.shadow.join('; ') },
                { name: 'Keywords:', value: card.keywords.join(', ') },
            ],
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL()
            },
            image: { url: `attachment://tarot.png` },
            color: theme.default,
        } : {
            title: card.name,
            description: await ollama(generatePrompt(card as Card, 'mixed')),
            color: theme.default,
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL()
            },
            image: { url: `attachment://tarot.png` },
        }]

        await interaction.followUp({
            embeds, files: [new AttachmentBuilder(deck.filename(card)).setName(`tarot.png`)]
        });
    }
} as Command;


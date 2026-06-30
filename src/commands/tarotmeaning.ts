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
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'card',
            description: 'What kind of reading do you want to',
            autocomplete: true,
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'format',
            description: 'How should the card result be shown?',
            choices: [
                { name: 'Short written reading · fun, may be slower', value: 'reading' },
                { name: 'Simple card info', value: 'simple' },
            ],
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'deck',
            description: 'Which deck images to use?',
            choices: Object.keys(decks).map(key => { return { value: key, name: decks[key].name } }),
        },
    ],
    getAutoCompleteOptions: async (client: Client, interaction: CommandInteraction, query: string) => {
        let options = cardNames.filter(choice => choice.toLowerCase().includes(query.toLowerCase()));

        return options.map(choice => { return { name: choice, value: choice } })
    },
    run: async (client: Client, interaction: CommandInteraction) => {
        const cardName: string = interaction.options.get('card')?.value as string
        const deckName: string = interaction.options.get('deck')?.value as string || defaultDeckName

        const isInterpreting: boolean = (interaction.options.get('format')?.value as string || 'simple') == 'reading'
        const card = tarotInterpertation.find(x => x.name == cardName);

        let deck: Deck = tryDeck(deckName);

        const embeds = [{
            title: card.name,
            description: isInterpreting ? 'Reading...' : card.fortune_telling.random(),
            ...(!isInterpreting && {
                fields: [
                    { name: 'Light:', value: card.meanings.light.random() },
                    { name: 'Shadow:', value: card.meanings.shadow.random() },
                    { name: 'Keywords:', value: card.keywords.join(', ') },
                ],
            }),
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL()
            },
            image: { url: `attachment://tarot.png` },
            color: theme.default,
        }]

        const followUp = await interaction.followUp({
            embeds, files: [new AttachmentBuilder(deck.filename(card)).setName(`tarot.png`)]
        });

        if (isInterpreting) {
            const response = await ollama(generatePrompt(card as Card, 'mixed'));
            if (response.success) {
                embeds[0].description = response.response;
            } else {
                embeds[0].description = card.fortune_telling.random() + '\n\nReading format service is unavailable at this time. :sad:'
            }
            await interaction.webhook.editMessage(followUp.id, { embeds });
        }
    }
} as Command;


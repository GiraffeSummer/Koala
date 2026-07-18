import { ChatInputCommandInteraction, AutocompleteInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { Card, defaultDeckName } from '../lib/Tarot/Tarot';
import { type Deck, decks, tryDeck } from '../lib/Tarot/Decks';
import tarotInterpretation from '../lib/Tarot/interpretation';
import {  ReadingPosition, readingPositionLabels, readings } from "../lib/Tarot/generatePrompt";
import { generateInterpretationEmbed } from "./tarot";
const cardNames = tarotInterpretation.map(x => x.name)

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
                { name: 'Short written reading', value: 'reading' },
                { name: 'Simple card info', value: 'simple' },
            ],
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'position',
            description: 'How should the card result be shown?',
            choices: Object.keys(readingPositionLabels).map(p => ({ name: readingPositionLabels[p], value: p })),
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'deck',
            description: 'Which deck images to use?',
            choices: Object.keys(decks).map(key => { return { value: key, name: decks[key].name } }),
        },
    ],
    getAutoCompleteOptions: async (client: Client, interaction: AutocompleteInteraction, query: string) => {
        let options = cardNames.filter(choice => choice.toLowerCase().includes(query.toLowerCase()));

        return options.map(choice => { return { name: choice, value: choice } })
    },
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const cardName: string = interaction.options.get('card')?.value as string
        const deckName: string = interaction.options.get('deck')?.value as string || defaultDeckName
        const position: ReadingPosition = interaction.options.get('position')?.value as ReadingPosition ?? 'generic'

        const isInterpreting: boolean = (interaction.options.get('format')?.value as string || 'simple') == 'reading'
        const card = tarotInterpretation.find(x => x.name == cardName) as Card;

        let deck: Deck = tryDeck(deckName);

        const embeds = [{
            ...generateInterpretationEmbed({ card, isInterpreting, interpretation: 'mixed', position }),
            title: `${card.name} ${position != 'generic' ? `(${readingPositionLabels[position]})` : ''}`.trim(),
            author: {
                name: interaction.user.username,
                icon_url: interaction.user.avatarURL()
            },
        }]

        await interaction.followUp({
            embeds, files: [new AttachmentBuilder(deck.filename(card)).setName(`${card.name}.png`)]
        });
    }
} as Command;


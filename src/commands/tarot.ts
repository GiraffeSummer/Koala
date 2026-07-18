import { ChatInputCommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import Tarot, { Card, CardType, defaultDeckName } from '../lib/Tarot/Tarot';
import { decks, } from '../lib/Tarot/Decks';
import theme from "../lib/theme";
import { ReadingMode, ReadingPosition, readings, } from "../lib/Tarot/generatePrompt";

const readingTypes: Record<string, ReadingPosition[]> = {
    single: ['generic'],

    pastPresentFuture: [
        'past',
        'present',
        'future',
    ],

    situationChallengeAdvice: [
        'present',
        'challenge',
        'advice',
    ],

    problemCauseSolution: [
        'challenge',
        'past',
        'advice',
    ],

    hiddenInfluenceAdvice: [
        'present',
        'hidden',
        'advice',
    ],

    situationActionFuture: [
        'present',
        'advice',
        'future',
    ],

    // More than 3 card readings, add when it looks better
    // horseshoe: [
    //     'past',
    //     'present',
    //     'hidden',
    //     'challenge',
    //     'advice',
    //     'future',
    // ],
    // celticCrossShort: [
    //     'present',
    //     'challenge',
    //     'past',
    //     'future',
    //     'hidden',
    //     'advice',
    // ],
} as const;

const toLabelCase = (value: string) =>
    value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, char => char.toUpperCase());

export default {
    name: "tarot",
    description: "do a tarot reading",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [
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
            name: 'spread',
            description: 'Which spread should the written reading use? For written readings only: choose the spread.',
            choices: [
                { name: 'Single card', value: 'single' },
                { name: 'Past / Present / Future', value: 'pastPresentFuture' },
                { name: 'Situation / Challenge / Advice', value: 'situationChallengeAdvice' },
                { name: 'Problem / Cause / Solution', value: 'problemCauseSolution' },
                { name: 'Hidden Influence / Advice', value: 'hiddenInfluenceAdvice' },
                { name: 'Situation / Action / Future', value: 'situationActionFuture' },
                // { name: 'Horseshoe', value: 'horseshoe' },
                // { name: 'Short Celtic Cross', value: 'celticCrossShort' },
            ],
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'set',
            description: 'What kind of reading do you want to',
            choices: [CardType.All, CardType.Major, CardType.Minor].map(x => { return { name: CardType[x], value: x } }),
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'deck',
            description: 'Which deck images to use?',
            choices: Object.keys(decks).map(key => { return { value: key, name: decks[key].name } }),
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'interpretation',
            description: 'Optional: choose the focus of the reading.',
            choices: [
                { name: 'Balanced', value: 'mixed' },
                { name: 'Supportive', value: 'light' },
                { name: 'Challenging', value: 'shadow' },
            ],
        }
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const type: CardType = interaction.options.get('set')?.value as CardType || CardType.All;
        const deck: string = interaction.options.get('deck')?.value as string || defaultDeckName

        const isInterpreting: boolean = (interaction.options.get('format')?.value as string || 'reading') == 'reading'
        const interpretation: ReadingMode = interaction.options.get('interpretation')?.value as ReadingMode || 'mixed'
        const spread = interaction.options.get('spread')?.value as string ?? 'single';

        const readingPositions = spread in readingTypes ? readingTypes[spread] : readingTypes.single

        const cards = await Promise.all(Array.from({ length: readingPositions.length }, () => Tarot(type, deck)))

        const attachments = cards.map(card => new AttachmentBuilder(card.image).setName(`${card.name}.png`))
        const embeds = cards.map((card, i) => ({
            ...generateInterpretationEmbed({ card, isInterpreting, interpretation, position: readingPositions[i] }),
            title: `${card.name} ${readingPositions.length > 1 ? `(${toLabelCase(readingPositions[i])})` : ''}`.trim(),
        }))

        await interaction.followUp({
            embeds, files: attachments
        });
    }
} as Command;

export function generateInterpretationEmbed(params: { card: Card, isInterpreting: boolean, interpretation: ReadingMode, position: ReadingPosition }) {
    const { card, isInterpreting, interpretation, position } = params;
    return {
        title: card.name,
        description: isInterpreting ? readings[card.name][position][interpretation].random() : card.fortune_telling.random(),
        ...(!isInterpreting && {
            fields: [
                { name: 'Light:', value: card.meanings.light.random() },
                { name: 'Shadow:', value: card.meanings.shadow.random() },
                { name: 'Keywords:', value: card.keywords.join(', ') },
            ],
        }),

        thumbnail: { url: `attachment://${card.name}.png` },
        color: theme.default,
    }
}
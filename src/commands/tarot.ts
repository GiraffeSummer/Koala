import { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import Tarot, { Card, Suits, CardType, defaultDeckName } from '../lib/Tarot/Tarot';
import { decks, } from '../lib/Tarot/Decks';
import theme from "../lib/theme";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "tarot",
    description: "do a tarot reading",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [{
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
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const type: CardType = interaction.options.get('set')?.value as CardType || CardType.All;
        const deck: string = interaction.options.get('deck')?.value as string || defaultDeckName
        const card = await Tarot(type, deck);

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
                icon_url: interaction.user.avatarURL()
            },
            image: { url: `attachment://tarot.png` },
            color: theme.default,
        }]

        await interaction.followUp({
            embeds, files: [new AttachmentBuilder(card.image).setName(`tarot.png`)]
        });
    }
} as Command;
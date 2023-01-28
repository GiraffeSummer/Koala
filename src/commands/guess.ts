import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import type NumberGuesser from '../lib/NumberGuesser';

import prisma, { where, FindOrCreateUser } from "../lib/db";
import { formatDistance } from 'date-fns'

const timeAmount = 3 * 60 * 60 * 1000
export default {
    name: "guess",
    description: "Guess a number",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.Number,
        name: 'number',
        description: 'Number to guess',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const number = interaction.options.get('number')?.value as number
        const profile = await FindOrCreateUser(interaction.user);

        const timeDif = new Date().getTime() - profile.guessTimer.getTime()
        const readableDif = formatDistance(profile.guessTimer.getTime() + timeAmount, Date.now())
        if (timeAmount > timeDif) {
            return await interaction.followUp({ ephemeral: true, components: [], content: `You need to wait \`${readableDif}\` to do this again!` })
        }

        const numberGuesser: NumberGuesser = client['numberGuesser'];
        const guess = numberGuesser.Guess(number);

        //update the timer
        await prisma.user.update({ where: { uid: interaction.user.id }, data: { guessTimer: new Date() } })

        let content = `\`${number}\` is Incorrect!`

        if (guess) {
            content = `You got it, the number was ${number} after \`${numberGuesser.guesses.length}\` guesses,\nYou've earned the badge!`
            numberGuesser.Reward(interaction);
            numberGuesser.Reset();
        }

        await interaction.followUp({
            content
        });
    }
} as Command;
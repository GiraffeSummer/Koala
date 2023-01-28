import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import seedrandom from 'seedrandom'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "rate",
    description: "Rate something",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'rate',
        description: 'What to rate',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const rate = interaction.options.get('rate')?.value as string || null

        let modString = rate.split(' ').map(x => {
            if (x.toLowerCase() == "your")
                x = "my"

            if (x.toLowerCase() == "my")
                x = "your"

            if (x.toLowerCase() == "me")
                x = "you"

            if (x.toLowerCase() == client.user.username.toLowerCase())
                x = "myself"

            return x;
        }).join(' ');

        const rng = Math.floor(seedrandom(modString + " " + interaction.user.id)() * (10 - 1 + 1)) + 1;

        await interaction.followUp({
            embeds: [{
                title: modString,
                color: 0x4169e1,
                description: `I rate **${modString}** a ${rng}/10!`,
            }]
        });
    }
} as Command;
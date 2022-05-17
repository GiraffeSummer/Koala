import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'
import seedrandom from 'seedrandom'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "rate",
    description: "Rate something",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'rate',
        description: 'What to rate',
        required: true
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
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

        const embed = new Embed(modString).setColor('4169e1').setDescription(`I rate **${modString}** a ${rng}/10!`)

        await interaction.followUp({
            embeds: embed.get()
        });
    }
} as Command;
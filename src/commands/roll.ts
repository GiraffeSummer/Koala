import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'
import { RandomNum } from '../lib/Functions'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "roll",
    description: "Roll a dice",
    type: "CHAT_INPUT",
    options: [{
        type: 'NUMBER',
        name: 'd',
        description: 'How many sides should the dice have?',
        required: true
    },
    {
        type: 'NUMBER',
        name: 'amount',
        description: 'How many dice?'
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const dice = interaction.options.get('d')?.value as number || null
        const amount = interaction.options.get('amount')?.value as number || 1
        let out: any = { multi: amount > 1 }

        if (out.multi) {
            let results = []
            for (let i = 0; i < amount; i++) {
                results.push(RandomNum(dice, 1));
            }

            out = { result: results, total: results.reduce((a, b) => a + b, 0) };
        } else {
            let result = RandomNum(dice, 1);
            out = { result, total: result };
        }
        out.roll = { amount, dice };

        const embed = new Embed(`Result: ${out.total}:game_die:`)
            .setColor('4169e1')
            .setAuthor(interaction.user.username, '', interaction.user.avatarURL({ dynamic: true }))
            .setDescription(`${(out.multi) ? `\`${out.result.join(', ')}\`` : ""}`)

        await interaction.followUp({
            ephemeral: true,
            embeds: embed.get()
        });
    }
} as Command;
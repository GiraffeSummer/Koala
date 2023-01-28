import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { RandomNum } from '../lib/Functions'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "roll",
    description: "Roll a dice",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.Integer,
        name: 'd',
        description: 'How many sides should the dice have?',
        required: true
    },
    {
        type: ApplicationCommandOptionType.Integer,
        name: 'amount',
        description: 'How many dice?'
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const dice = interaction.options.get('d')?.value as number || null
        const amount = interaction.options.get('amount')?.value as number || 1
        let out: any = { multi: (amount > 1) }

        if (out.multi) {
            let results = []
            for (let i = 0; i < amount; i++) {
                results.push(RandomNum(dice, 1));
            }

            out = { ...out, result: results, total: results.reduce((a, b) => a + b, 0) };
        } else {
            let result = RandomNum(dice, 1);
            out = { ...out, result, total: result };
        }
        out.roll = { amount, dice };

        await interaction.followUp({
            embeds: [{
                title: `Result: ${out.total}:game_die:`,
                color: 0x4169e1,
                author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() },
                description: `${(out.multi) ? `\`${out.result.join(', ')}\`` : ""}`
            }]
        });
    }
} as Command;
import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { DiceRoll } from '@dice-roller/rpg-dice-roller';

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "dice",
    description: "Roll a dice",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'notation',
        description: 'How many sides should the dice have?',
        required: true
    },
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        const notation = interaction.options.get('notation').value as string
        const roll = new DiceRoll(notation);
        await interaction.followUp({
            embeds: [{
                title: `Result: ${roll}:game_die:`,
                color: 0x4169e1,
                author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() },
                // description: `${(roll.multi) ? `\`${out.result.join(', ')}\`` : ""}`
            }]
        });
    }
} as Command;
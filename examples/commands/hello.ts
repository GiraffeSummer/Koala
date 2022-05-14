import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";


//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "hello",
    description: "Returns a greeting",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'food',
        description: 'What food do you like?'
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello there!" + ` ${interaction.options.get('food')?.value || ''}`;

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
} as Command;
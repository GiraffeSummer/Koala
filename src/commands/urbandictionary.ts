import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import fetch, { METHODS } from '../lib/fetch';

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "urbandictionary",
    description: "Find a word in urban dictionary",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'define',
        description: 'What does this mean?',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const define = interaction.options.get('define')?.value as string || null
        const body = (await fetch('http://api.urbandictionary.com/v0/define?term=' + define.split(' ').join('%20'))).data

        if (body.list.length <= 0) return await interaction.editReply({
            content: 'nothing found for `' + define + "`"
        });

        const { definition, permalink, word, example } = body.list[0];

        await interaction.followUp({
            ephemeral: true,
            embeds: [{
                title: word,
                description: definition + '\n\nExample: ' + example,
                url: permalink
            }]
        });
    }
} as Command;
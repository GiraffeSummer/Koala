import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import fetch, { METHODS } from '../lib/fetch';
import Embed from '../lib/Embed';

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "urbandictionary",
    description: "Find a word in urban dictionary",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'define',
        description: 'What does this mean?',
        required: true
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const define = interaction.options.get('define')?.value as string || null
        const body = (await fetch('http://api.urbandictionary.com/v0/define?term=' + define.split(' ').join('%20'))).data

        if (body.list.length <= 0) return await interaction.editReply({
            content: 'nothing found for `' + define + "`"
        });

        const { definition, permalink, word, example } = body.list[0];

        const embed = new Embed(word)
            .setDescription(definition + '\n\nExample: ' + example)
            .setUrl(permalink);

        await interaction.followUp({
            ephemeral: true,
            embeds: embed.get()
        });
    }
} as Command;
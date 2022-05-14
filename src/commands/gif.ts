import { BaseCommandInteraction, Client, CommandInteractionOption, TextChannel } from "discord.js";
import fetch from '../lib/fetch'
import { Command } from "../Command";
import Embed from '../lib/Embed'

export default {
    name: "gif",
    description: "Send a reaction gif",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'tag',
        description: 'Filter tag?',
        required: true
    },
    {
        type: 'BOOLEAN',
        name: 'nsfw',
        description: 'allow nsfw'
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const tag: CommandInteractionOption | null = interaction.options.get('tag') || null

        const channel: TextChannel = await client.channels.fetch(interaction.channelId) as TextChannel;

        const nsfwProp = interaction.options.get('nsfw')?.value || false;
        const nsfw = nsfwProp ? channel.nsfw : false;

        if (tag != null) {
            const body: any = (await fetch('https://gifmonkey.cripplerick.com/api/find/' + tag.value + `?nsfw=${nsfw}`)).data
            const gif = body.gifs[0] || null;

            if (gif !== null) {
                const embed = new Embed(gif.name)
                    .setImage(gif.url)
                    .setColor('ff00ff')
                    .setDescription('**Tags:** ' + gif.tags.join(', '));

                return await interaction.followUp(
                    {
                        ephemeral: true,
                        embeds: embed.get()
                    });
            }
        }
        return await interaction.followUp(
            {
                ephemeral: true,
                content: `nothing found for \`${tag.value}\``
            });


    }
} as Command;

import { CommandInteraction, Client, CommandInteractionOption, TextChannel, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import fetch from '../lib/fetch'
import { Command } from "../Command";

export default {
    name: "gif",
    description: "Send a reaction gif",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'tag',
        description: 'Filter tag?',
        required: true
    },
    {
        type: ApplicationCommandOptionType.Boolean,
        name: 'nsfw',
        description: 'allow nsfw'
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const tag: CommandInteractionOption | null = interaction.options.get('tag') || null

        const channel: TextChannel = await client.channels.fetch(interaction.channelId) as TextChannel;

        const nsfwProp = interaction.options.get('nsfw')?.value || false;
        const nsfw = nsfwProp ? channel.nsfw : false;

        if (tag != null) {
            const body: any = (await fetch('https://gifmonkey.cripplerick.com/api/find/' + tag.value + `?nsfw=${nsfw}`)).data
            const gif = body.gifs[0] || null;

            if (gif !== null) {

                const embed = {
                    title: gif.name,
                    image: { url: gif.url },
                    color: 0xff00ff,
                    description: '**Tags:** ' + gif.tags.join(', ')
                }

                return await interaction.followUp(
                    {
                        ephemeral: false,
                        embeds: [embed]
                    });
            }
        }

        await interaction.deleteReply();
        return await interaction.followUp(
            {
                ephemeral: true,
                content: `nothing found for \`${tag.value}\``
            });


    }
} as Command;

import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { Command } from "../Command";
import fetch from "node-fetch";
import theme from "../lib/theme";

export default {
    name: "findanime",
    description: "Find what anime an image is from",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.Attachment,
        name: 'image',
        description: 'Image to look for',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const attachment = interaction.options.get('image')?.attachment || null;

        const response = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(
            attachment.url
        )}`)
        if (response.status !== 200) {
            return await interaction.followUp({ content: 'Error status: ' + response })
        }
        const data = await response.json();
        if (data.error !== "") {
            return await interaction.followUp({ content: 'Error: ' + data.error })
        }

        async function GetPrediction(index: number = 0) {
            const prediction = data.result[index];

            const anilistInfo = await getAniListInfo(prediction.anilist).catch(async err => {
                return await interaction.followUp({ content: 'Error: ' + err.message })
            })
            return { ...prediction, anilist: anilistInfo }
        }

        const prediction = await GetPrediction();

        const row = buttonBuilder(0, data.result.length);

        const reply = await interaction.followUp({
            embeds: [PredictionEmbed(prediction, attachment)],
            components: [row]
        });

        const collector = reply.createMessageComponentCollector({
            filter: (i) => {
                return i.user.id == interaction.user.id
            },
            time: 2 * 60 * 1000
        });

        collector.on('collect', async i => {
            let newNum = 0;
            if (i.customId.startsWith('anime-next')) {
                newNum = parseInt(i.customId.slice('anime-next'.length))
            } else {
                newNum = parseInt(i.customId.slice('anime-prev'.length))
            }
            i.update({
                embeds: [PredictionEmbed(await GetPrediction(newNum), attachment)],
                components: [buttonBuilder(newNum, data.result.length)]
            })
        });

        collector.on('end', async () => {
            await reply.edit({ components: [] })
        })
    }
} as Command;

function buttonBuilder(page: number = 0, maxPages: number = 5, showPage: boolean = false) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    if (page > 0) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('anime-prev' + `${page - 1}`)
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Primary))
    }
    if (showPage) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('pagenum')
            .setLabel(`${page}/${maxPages}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger));
    }
    if (page + 1 < maxPages) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('anime-next' + `${page + 1}`)
            .setEmoji('▶️')
            .setStyle(ButtonStyle.Primary));
    }

    return row;
}

function PredictionEmbed(prediction, attachment) {
    return {
        title: `${prediction.anilist.title.romaji}`,
        thumbnail: { url: attachment.url },
        image: { url: prediction.image },
        color: theme.default,
        description: `${(prediction.episode) ? `Episode: ${prediction.episode}` : ''}
        Romaji: ${prediction.anilist.title.romaji}
        English: ${prediction.anilist.title.english}
        Native: ${prediction.anilist.title.native}
        `,
        fields: [{ name: 'similarity', value: `${prediction.similarity * 100}`.substring(0, 4) + '%' },]
    }
}


async function getAniListInfo(animeId: number): Promise<any> {
    const query = `
        query ($id: Int) {
          Media (id: $id, type: ANIME) { 
            id
            title {
              romaji
              english
              native
            }
            isAdult
            synonyms
          }
        }
        `;

    const variables = {
        id: animeId
    }

    const response = await fetch('https://graphql.anilist.co',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

    if (response.status === 200) {
        return (await response.json()).data.Media;
    }
    else throw new Error(response.statusText)
}
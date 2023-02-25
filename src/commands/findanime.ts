import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ButtonInteraction, Interaction } from "discord.js";
import { Command } from "../Command";
import fetch from "node-fetch";
import theme from "../lib/theme";

const cacheTimer = 10 * 60 * 1000;//10 minutes
const cache = new Map<string, null | { error?: any, result?: any }>();
function timeClearCacheEntry(key) {
    setTimeout(() => {
        console.log('clearing cache for: ' + key)
        if (cache.has(key))
            cache.delete(key);
    }, cacheTimer)
}

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
    buttonHandler: {
        match: (customId) => customId.startsWith('anime-next') || customId.startsWith('anime-prev') || customId == 'anime-first',
        filter: (interaction) => interaction.message?.interaction.user.id == interaction.user.id,
        execute: ButtonHandler,
        maxAgeMs: 24 * 60 * 60 * 1000,//24 hours
    },
    run: async (client: Client, interaction: CommandInteraction) => {
        const attachment = interaction.options.get('image')?.attachment || null;

        const anime = await GetAnime(attachment.url)
            .catch(async err => {
                if (err instanceof InvalidDataError) {
                    await interaction.followUp({ content: err.message })
                    return null;
                }
            });

        if (anime == null) return await interaction.followUp({ content: 'nothing found' })

        const { data, GetPrediction } = anime;

        const prediction = await GetPrediction(0)

        const row = buttonBuilder(0, data.result.length);

        const reply = await interaction.followUp({
            embeds: [PredictionEmbed(prediction, attachment.url)],
            components: [row]
        });
    },
} as Command;

async function GetAnime(imageUrl: string) {
    let data;
    if (cache.has(imageUrl)) {
        data = cache.get(imageUrl);
    } else {
        const response = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(
            imageUrl
        )}`)
        if (response.status !== 200) {
            throw new InvalidDataError('Error status: ' + response);
            // return await interaction.followUp({ content: 'Error status: ' + response })
        }
        data = await response.json();
        cache.set(imageUrl, data);
        timeClearCacheEntry(imageUrl);
    }
    if (data.error !== "") {
        throw new InvalidDataError('Error: ' + data.error);
        //return await interaction.followUp({ content: 'Error: ' + data.error })
    }

    async function GetPrediction(index: number = 0) {
        const prediction = data.result[index];

        const anilistInfo = await getAniListInfo(prediction.anilist).catch(async err => {
            //return await interaction.followUp({ content: 'Error: ' + err.message })
            throw new InvalidDataError('Error: ' + err.message)
        })
        return { ...prediction, anilist: anilistInfo }
    }

    return { data, GetPrediction };
}

class InvalidDataError extends Error { }

async function ButtonHandler(client: Client, interaction: ButtonInteraction): Promise<boolean> {
    //get source from embed?
    const image = interaction.message.embeds[0].thumbnail.url;

    const anime = await GetAnime(image)
        .catch(async err => {
            if (err instanceof InvalidDataError) {
                await interaction.reply({ content: err.message })
                return null;
            }
        });

    if (anime == null) {
        await interaction.reply({ content: 'nothing found' })
        return false
    }
    const { data, GetPrediction } = anime;

    let newNum = 0;
    if (interaction.customId != 'anime-first') {
        if (interaction.customId.startsWith('anime-next')) {
            newNum = parseInt(interaction.customId.slice('anime-next'.length))
        } else {
            newNum = parseInt(interaction.customId.slice('anime-prev'.length))
        }
    }
    interaction.update({
        embeds: [PredictionEmbed(await GetPrediction(newNum), image)],
        components: [buttonBuilder(newNum, data.result.length)]
    })

    return true;
}

function buttonBuilder(page: number = 0, maxPages: number = 5, showPage: boolean = true, showFirstButton: boolean = true) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    if (showFirstButton && page > 1) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('anime-first')
            .setEmoji('⏮️')
            .setStyle(ButtonStyle.Primary))
    }
    if (page > 0) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('anime-prev' + `${page - 1}`)
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Primary))
    }
    if (showPage) {
        row.addComponents(new ButtonBuilder()
            .setCustomId('pagenum')
            .setLabel(`${page + 1}/${maxPages}`)
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

function PredictionEmbed(prediction, attachmentUrl) {
    return {
        title: `${prediction.anilist.title.romaji}`,
        thumbnail: { url: attachmentUrl },
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
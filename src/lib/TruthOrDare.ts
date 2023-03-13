import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { RandomNum, chunk_array } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";


type QuestionType = 'truth' | 'dare' | 'paranoia' | 'neverhaveiever' | 'wouldyourather'

type QuestionMapType = Record<QuestionType | 'random_tod', { customId: string, function: () => Promise<{ question: string, type: string }>, buttonList: ButtonEntry[] }>
const otherButton: ButtonEntry = { customId: 'tod-other', label: 'more' };
export const questionMap: QuestionMapType = {
    'truth': {
        customId: 'tod-truth',
        function: () => getQuestion('truth'),
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
            otherButton,
        ],
    },
    'dare': {
        customId: 'tod-dare',
        function: () => getQuestion('dare'),
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
            otherButton,
        ],
    },
    'random_tod': {
        customId: 'tod-random',
        function: getRandom,
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
            otherButton,
        ],
    },

    'paranoia': { customId: 'tod-paranoia', buttonList: [{ label: 'paranoia', customId: 'tod-paranoia' }, otherButton], function: () => getQuestion('paranoia') },
    'neverhaveiever': { customId: 'tod-nhie', buttonList: [{ label: 'Never have I ever', customId: 'tod-nhie' }, otherButton], function: () => getQuestion('neverhaveiever') },
    'wouldyourather': { customId: 'tod-wyr', buttonList: [{ label: 'Would you rather', customId: 'tod-wyr' }, otherButton], function: () => getQuestion('wouldyourather') },
}

export const allowedIds = ['tod-other', ...Object.keys(questionMap).map(x => questionMap[x].customId)];

const otherButtons = makeButtons(
    Object.values(questionMap)
        .reduce((carry, item) => {
            item.buttonList.forEach(btn => {
                if (btn.customId == 'tod-other') return;
                if (carry.findIndex(x => x.customId == btn.customId) < 0) {
                    carry.push(btn)
                }
            })
            return carry;
        }, [])
);

type ButtonEntry = {
    customId: string,
    label: string,
    style?: ButtonStyle,
}

export async function makeButtons(buttons?: ButtonEntry[]) {
    //will only work with 5 buttons or less
    return chunk_array(buttons, 5).map(buttonRow => {
        const row = new ActionRowBuilder<ButtonBuilder>();
        return row.addComponents(buttonRow.map(btn => {
            return new ButtonBuilder()
                .setCustomId(btn.customId)
                .setLabel(btn.label)
                .setStyle(btn.style ?? ButtonStyle.Primary)
        }))
    })
}

export async function InitializeMessage(interaction: CommandInteraction, questionType: QuestionType) {
    const functionObject = questionMap[questionType]
    const { question, type } = await functionObject.function();

    await interaction.followUp({
        embeds: [{
            title: question,
            description: '> type: *' + type + '*',
            color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() }
        }],
        components: functionObject.buttonList?.length > 0 ? await makeButtons(functionObject.buttonList) : []
    });
}

export async function HandleTODButtonInteraction(client: Client, interaction: ButtonInteraction) {
    const truthOrDareIDs = allowedIds;
    if (interaction.customId == 'tod-other') {
        await interaction.message.edit({
            components: await otherButtons
        })
        interaction.deferUpdate();
        return true;
    } else if (truthOrDareIDs.includes(interaction.customId)) {
        interaction.message.edit({ components: [] })
        const functionObject = Object.values(questionMap).find(m => m.customId === interaction.customId)
        let { question, type } = await functionObject.function();
        const components = functionObject.buttonList?.length > 0 ? await makeButtons(functionObject.buttonList) : []

        interaction.message.reply({
            embeds: [{
                title: question,
                description: '> type: *' + type + '*',
                color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() }
            }],
            components: components,
        }).catch(err => {
            interaction.message.channel.send({ content: `Something went wrong!\nMake sure I have the read message history and send message permissions` })
        });
        return true;
    } else return false;
}


export async function getQuestion(type: QuestionType) {
    const count: number = await prisma[type].count();
    const question = await prisma[type].findFirst({ skip: RandomNum(count), take: 1 });
    if (!question) return await getQuestion(type);
    return { type, question: question.question };
}

async function getRandom() {
    if (RandomNum(1) == 0) {
        return { type: 'dare', ...(await getQuestion('dare')) };
    } else {
        return { type: 'truth', ...(await getQuestion('truth')) };
    }
}
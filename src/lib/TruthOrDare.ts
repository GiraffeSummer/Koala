import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, TextChannel, Message, ComponentType } from "discord.js";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";


export const functionmap = {
    truth: {
        customID: 'tod-truth',
        function: getTruth,
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
        ],
    },
    dare: {
        customID: 'tod-dare',
        function: getDare,
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
        ],
    },
    random_tod: {
        customID: 'tod-random',
        function: getRandom,
        buttonList: [
            { customId: 'tod-truth', label: 'truth', style: ButtonStyle.Success },
            { customId: 'tod-dare', label: 'dare', style: ButtonStyle.Danger },
            { customId: 'tod-random', label: 'random' },
        ],
    },

    paranoia: { customID: 'tod-paranoia', buttonList: [{ label: 'paranoia', customId: 'tod-paranoia' }], function: getParanoia },
    neverhaveiever: { customID: 'tod-nhie', buttonList: [{ label: 'Never have I ever', customId: 'tod-nhie' }], function: getNeverhaveIever },
    wouldyourather: { customID: 'tod-wyr', buttonList: [{ label: 'Would you rather', customId: 'tod-wyr' }], function: getWouldYouRather },
}

export const allowedIds = Object.keys(functionmap).map(x => functionmap[x].customID);

export const todButtonList = [
    { customId: functionmap.truth.customID, label: 'truth', style: ButtonStyle.Success },
    { customId: functionmap.dare.customID, label: 'dare', style: ButtonStyle.Danger },
    { customId: functionmap.random_tod.customID, label: 'random' },
]

type ButtonEntry = {
    customId: string,
    label: string,
    style?: ButtonStyle,
}

export async function makeButtons(buttons: ButtonEntry[]) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    return row.addComponents(buttons.map(btn => {
        return new ButtonBuilder()
            .setCustomId(btn.customId)
            .setLabel(btn.label)
            .setStyle(btn.style ?? ButtonStyle.Primary)
    }))
}

//TODO: 
//WORK IN PROGRESS
export async function addButtons(a, i, o) {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(functionmap.truth.customID)
                .setLabel('truth')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(functionmap.dare.customID)
                .setLabel('dare')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(functionmap.random_tod.customID)
                .setLabel('random')
                .setStyle(ButtonStyle.Primary),
        );

    return row;
}

export async function InitializeMessage(interaction, type: keyof typeof functionmap) {
    const functionObject = functionmap[type]
    const question: string = await functionObject.function();

    await interaction.followUp({
        embeds: [{ description: question, color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() } }],
        components: [await makeButtons(functionObject.buttonList)]
    });
}

export async function HandleTODButtonInteraction(client: Client, interaction: ButtonInteraction) {
    const truthOrDareIDs = allowedIds;
    if (truthOrDareIDs.includes(interaction.customId)) {
        interaction.message.edit({ components: [] })
        const functionObject = Object.values(functionmap).find(m => m.customID === interaction.customId)
        let question = await functionObject.function();
        let buttonList: ButtonEntry[] | null = functionObject.buttonList ?? null;

        interaction.message.reply({ embeds: [{ description: question, color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() } }], })
            .then(async int => {
                if (buttonList != null)
                    int.edit({ components: [await makeButtons(buttonList)] })
            }).catch(err => {
                interaction.message.channel.send({ content: `Something went wrong!\nMake sure I have the read message history and send message permissions` })
            });
        return true;
    } else return false;
}

export async function getTruth() {
    const count: number = await prisma.truth.count();
    const question: string = (await prisma.truth.findFirst({ skip: RandomNum(count), take: 1 })).question;
    return question;
}
export async function getDare() {
    const count: number = await prisma.dare.count();
    const question: string = (await prisma.dare.findFirst({ skip: RandomNum(count), take: 1 })).question;
    return question;
}

export async function getParanoia() {
    const count: number = await prisma.paranoia.count();
    return (await prisma.paranoia.findFirst({ skip: RandomNum(count), take: 1 })).question;
}

export async function getNeverhaveIever() {
    const count: number = await prisma.neverhaveiever.count();
    return (await prisma.neverhaveiever.findFirst({ skip: RandomNum(count), take: 1 })).question;
}

export async function getWouldYouRather() {
    const count: number = await prisma.wouldyourather.count();
    return (await prisma.wouldyourather.findFirst({ skip: RandomNum(count), take: 1 })).question;
}

async function getRandom() {
    if (RandomNum(1) == 0) {
        return await getDare();
    } else {
        return await getTruth();
    }
}
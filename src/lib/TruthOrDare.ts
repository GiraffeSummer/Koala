import { CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, TextChannel, Message, ComponentType } from "discord.js";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";

//TODO: 
//WORK IN PROGRESS
export async function addButtons(client: Client, message: Message, question) {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('truth')
                .setLabel('truth')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('dare')
                .setLabel('dare')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('random')
                .setLabel('random')
                .setStyle(ButtonStyle.Primary),
        );

    const channel = await client.channels.fetch(message.channelId) as TextChannel;
    const collector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        max: 1,
        time: 300 * 1000
    })

    collector.on('end', async (collection) => {
        collection.forEach(async click => {
            if (click.message.id !== message.id) return;
            message.edit({ components: [] })
            let question;
            switch (click.customId) {
                case 'truth':
                    question = await getTruth();
                    break;

                case 'dare':
                    question = await getDare();
                    break

                case 'random':
                    question = await getRandom();
                    break;

                default:
                    break;
            }

            message.reply({ embeds: [{ description: question, color: theme.default, author: { name: click.user.username, icon_url: click.user.avatarURL() } }], })
                .then(async int => {
                    int.edit({ components: [await addButtons(client, int, question,)] })
                }).catch(err => {
                    message.channel.send({ content: `Something went wrong!\nMake sure I have the read message history and send message permissions` })
                });

        })
    })

    return row;
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
async function getRandom() {
    if (RandomNum(1) == 0) {
        return await getDare();
    } else {
        return await getTruth();
    }
}
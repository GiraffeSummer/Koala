import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, ButtonInteraction, TextChannel } from "discord.js";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";

//TODO: 
//WORK IN PROGRESS
export async function addButtons(client, interaction, question) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('truth')
                //just.setEmoji('💍')
                .setLabel('truth')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('dare')
                //.setEmoji('💔')
                .setLabel('dare')
                .setStyle('DANGER'),
            new MessageButton()
                .setCustomId('random')
                // .setEmoji('💔')
                .setLabel('random')
                .setStyle("PRIMARY"),
        );

    const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
    const collector = channel.createMessageComponentCollector({
        componentType: "BUTTON",
        max: 1,
        time: 300 * 1000
    })

    collector.on('end', async (collection) => {
        collection.forEach(async click => {
            console.log(click.message.id)
            if(click.message.id !== interaction.message.id) return;
            interaction.editReply({
                ...interaction, components: []
            })
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

            const int = await channel.send({ embeds: [{ description: question, color: theme.default }] });
            await addButtons(client, int, question);
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
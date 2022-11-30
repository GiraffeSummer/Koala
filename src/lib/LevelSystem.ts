import prisma, { where, FindOrCreateUser } from "../lib/db";
import { Message, BaseCommandInteraction as Interaction, User } from 'discord.js';

const levelMessages = true;

export async function addExpInteraction(interaction: Interaction, exp: number = 1, userOb: any = null) {

    const { user, leveled } = await addExp(userOb || interaction.user, exp);

    if (leveled && levelMessages) {
        interaction.followUp({
            ephemeral: true,
            embeds: [{
                color: 0x0000ff,
                description: `You levelled up to level: **${user.lvl}**!`,
                title: "**LEVEL UP**"
            }]
        })
    }

    return { user, leveled }
}

export async function addExpMessage(message: Message, exp: number = 1, userOb: any = null) {

    const { user, leveled } = await addExp(userOb || message.author, exp);

    if (leveled && levelMessages) {
        message.reply({
            embeds: [{
                color: 0x0000ff,
                description: `You levelled up to level: **${user.lvl}**!`,
                title: "**LEVEL UP**"
            }]
        })
    }

    return { user, leveled }
}

export async function addExp(userOb: User, exp = 1) {
    let leveled = false;

    let user = await FindOrCreateUser(userOb);

    let newExp = user.toLvl - exp;
    if (newExp <= 0) {
        leveled = true;
        newExp = expNeeded(user.lvl) - (-newExp)
    }

    user = await prisma.user.update({
        where: { uid: user.uid }, data: {
            lvl: (leveled) ? user.lvl + 1 : user.lvl,
            toLvl: newExp
        }
    })
    return { user, leveled }
}

export function expNeeded(lvl: number): number {
    return (lvl + 1) * 10 + 10
}
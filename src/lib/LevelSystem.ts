import prisma, { where, FindOrCreateUser } from "../lib/db";

const levelMessages = false;

export async function addExp(interaction: any, exp: number = 1, userOb: any = null) {
    let leveled = false;

    let user = await FindOrCreateUser(userOb || interaction.user);

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

export function expNeeded(lvl: number): number {
    return (lvl + 1) * 10 + 10
}
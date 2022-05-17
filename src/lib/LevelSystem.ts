import prisma, { where, FindOrCreateUser } from "../lib/db";

export async function addExp(interaction: any, exp: number = 1, userOb: any = null) {
    let leveled = false;

    let user = await FindOrCreateUser(userOb || interaction.user);

    let newExp = user.toLvl - exp;
    if (newExp <= 0) {
        leveled = true;
        newExp = (user.lvl + 1) * 10 + 10 - (-newExp)
    }

    user = await prisma.user.update({
        where: { uid: user.uid }, data: {
            lvl: (leveled) ? user.lvl + 1 : user.lvl,
            toLvl: newExp
        }
    })

    if (leveled) {
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
import prisma, { where, FindOrCreateUser } from "../lib/db";

export async function addExp(userOb: any, exp: number = 1) {
    let leveled = false;

    let user = await FindOrCreateUser(userOb);

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

    return { user, leveled }
}
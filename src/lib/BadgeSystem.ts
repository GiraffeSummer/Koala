import prisma, { where, FindOrCreateUser } from "../lib/db";

export enum Status {
    Given,
    AlreadyOwns,
    Removed,
    Failed,
}

export async function addBadge(interaction: any, badgeId: number, userOb: any = null) {
    let user = await FindOrCreateUser(userOb || interaction.user);

    const alreadyHas = await prisma.badge_inventory.findFirst({
        where: {
            badgeid: badgeId,
            userid: user.uid,
        }
    })

    const badge = await prisma.badge.findFirst(where({ id: badgeId }))
    if (alreadyHas == null) {
        await prisma.badge_inventory.upsert({
            where: {
                userid_badgeid: {
                    badgeid: badgeId,
                    userid: user.uid,
                }
            },
            create: {
                userid: user.uid,
                badgeid: badgeId
            }, update: {}
        });
        interaction.followUp({ content: `You earned the ${badge.badge} \`${badge.name}\` badge!`, ephemeral: true })

        return { status: Status.Given, badge }
    } else {
        interaction.followUp({ content: `You already have ${badge.badge} \`${badge.name}\``, ephemeral: true })
        return { status: Status.AlreadyOwns, badge }
    }
}

export async function revokeBadge(interaction: any, badgeId: number, userOb: any) {
    let user = await FindOrCreateUser(userOb);

    const has = await prisma.badge_inventory.findFirst({
        where: {
            badgeid: badgeId,
            userid: user.uid,
        }
    })

    const badge = await prisma.badge.findFirst(where({ id: badgeId }))
    if (has == null) {
        await prisma.badge_inventory.delete({
            where: {
                userid_badgeid: {
                    badgeid: badgeId,
                    userid: user.uid,
                }
            }
        });
        interaction.followUp({ content: `You earned the ${badge.badge} \`${badge.name}\` badge!`, ephemeral: true })
        return { status: Status.Removed, badge }
    } else {
        return { status: Status.Failed, badge }
    }
}
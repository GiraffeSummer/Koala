import { Prisma } from "@prisma/client";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import {
    type Guild, type Collection
} from 'discord.js'

export async function Add(guild: Guild) {
    return await CheckOrUpdate(guild)
}

export async function CheckOrUpdate(guild: Guild) {
    return await prisma.guild.upsert({
        where: {
            id: guild.id,
        },
        update: {
            name: guild.name,
            active: true
        },
        create: {
            id: guild.id,
            name: guild.name
        },
    })
}

export async function CheckStillActiveSharded(guilds: Guild[]) {
    const ids = guilds.map((g) => g.id);

    const alReadyExists = await prisma.guild.findMany({ where: { id: { in: ids } } })
    const alReadyExistIds = alReadyExists.map((g) => g.id);
    const notExisting = guilds.filter(guild => !alReadyExistIds.includes(guild.id));

    notExisting.forEach(async guild => {
        await Add(guild);
    })

    const { count: active } = await prisma.guild.updateMany({
        where: { id: { in: ids } },
        data: { updatedAt: new Date(), active: true }
    })

    //update names
    Promise.all(
        Object.values(guilds).map(
            guild => {
                prisma.guild.update({
                    where: { id: guild.id },
                    data: { name: guild.name }
                })
            }
        )
    );

    console.log(`Created: ${notExisting.length} - Active: ${active}`);
}

export async function filterInactive(timeInactiveDays: number = 30) {
    const { count: removed } = await prisma.guild.updateMany({
        where: {
            updatedAt:
            {
                lte: new Date(new Date().setDate(new Date().getDate() - timeInactiveDays))
            },
            AND: { active: true }
        },
        data: { active: false }
    });
    console.log(`Inactive: ${removed}`)
}

//deprecated (doesnt work with sharding)
export async function CheckStillActive(guilds: Collection<any, Guild>) {
    const ids = guilds.map((g, id) => id);
    const dbGuilds = await prisma.guild.findMany({ where: { active: true } })

    let toCreate = ids.filter(cId => !dbGuilds.some(g => cId === g.id))
    let removed = []
    dbGuilds.forEach(async guild => {
        const exists = ids.includes(guild.id)//dbGuilds.some(x => ids.includes(x.id))

        const guildObj = await guilds.find(x => x.id == guild.id);
        const newName = guildObj?.name || guild?.name || 'NULL';
        console.log(`updating: ${guild.name} ${newName == guild?.name ? '' : '-> ' + newName}`)
        await prisma.guild.update({
            where: {
                id: guild.id,
            },
            data: {
                name: newName,
                active: exists
            }
        })
        if (!exists) {
            console.log(`removing '${guild.name}'`)
            removed.push(guild)
        }
    });

    if (toCreate.length >= 1) {
        let toCreateGuilds = guilds.filter(g => toCreate.includes(g.id))
        toCreateGuilds.forEach(guild => {
            console.log(`Adding '${guild.name}' `)
            Add(guild)
        })
    }
    return removed;
}

export async function Remove(guild: Guild) {
    try {
        return await prisma.guild.update({
            where: {
                id: guild.id,
            },
            data: {
                name: guild.name,
                active: false
            }
        })
    } catch (error) {
        return null
    }
}
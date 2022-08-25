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

export async function CheckStillActive(guilds: Collection<any, Guild>) {
    const ids = guilds.map((g, id) => id);
    const dbGuilds = await prisma.guild.findMany()

    let toCreate = ids.filter(cId => !dbGuilds.some(g => cId === g.id))
    let removed = []
    dbGuilds.forEach(async guild => {
        const exists = dbGuilds.some(x => ids.includes(x.id))

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
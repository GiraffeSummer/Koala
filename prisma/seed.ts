import { PrismaClient, Prisma } from '@prisma/client'

//@ts-ignore
import badges from './data/badges.json';
//@ts-ignore
import fortunes from './data/fortune.json';
//@ts-ignore
import magic8 from './data/magic8.json';
//@ts-ignore
import pickup from './data/pickup.json';
//@ts-ignore
import topics from './data/topics.json';
//@ts-ignore
import pronouns from './data/pronouns.json';

//@ts-ignore
import items from './data/items.json';

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    console.log(`Seeding bages.`)
    for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];
        await prisma.badge.upsert({ where: { id: badge.id }, create: badge, update: badge })
    }

    console.log(`Seeding fortune.`)
    for (let i = 0; i < fortunes.length; i++) {
        const item = fortunes[i];
        await prisma.fortune.upsert({ where: { id: item.id }, create: item, update: item })
    }

    console.log(`Seeding magic8.`)
    for (let i = 0; i < magic8.length; i++) {
        const item = magic8[i];
        await prisma.magic8.upsert({ where: { id: item.id }, create: item, update: item })
    }

    console.log(`Seeding pickup.`)
    for (let i = 0; i < pickup.length; i++) {
        const item = pickup[i];
        await prisma.pickup.upsert({ where: { id: item.id }, create: item, update: item })
    }

    console.log(`Seeding topics.`)
    for (let i = 0; i < topics.length; i++) {
        const item = topics[i];
        await prisma.topics.upsert({ where: { id: item.id }, create: item, update: item })
    }

    console.log(`Seeding pronouns.`)
    for (let i = 0; i < pronouns.length; i++) {
        const item = pronouns[i];
        await prisma.pronouns.upsert({ where: { id: item.id }, create: item, update: item })
    }

    console.log(`Seeding items.`)
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await prisma.item.upsert({ where: { id: item.id }, create: item, update: item })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
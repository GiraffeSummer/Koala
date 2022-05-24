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

const seeders = {
    'badge': badges,
    'fortune': fortunes,
    'magic8': magic8,
    'pickup': pickup,
    'topics': topics,
    'pronouns': pronouns,
    'item': items
}

async function main() {
    console.log(`Start seeding ...`)
    for (const [table, items] of Object.entries(seeders)) {
        console.log(`Seeding .`)
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            //console.log(`${table} ${i+1}/${items.length}`)
            await prisma[table].upsert({ where: { id: item.id }, create: item, update: item })
        }
    }
    console.log(`Done seeding!`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
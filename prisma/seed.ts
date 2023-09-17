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
//@ts-ignore
import rewards from './data/rewards.json';
//@ts-ignore
import wyr from './data/wouldyourather.json';
//@ts-ignore
import nhie from './data/neverhaveiever.json'
//@ts-ignore
import paranoia from './data/paranoia.json';
//@ts-ignore
import truth from './data/truth.json'
//@ts-ignore
import dare from './data/dare.json'


const prisma = new PrismaClient()

const seeders = {
    'badge': badges,
    'fortune': fortunes,
    'magic8': magic8,
    'pickup': pickup,
    'topics': topics,
    'pronouns': pronouns,
    'item': items,
    'reward': rewards,
    'wouldyourather': wyr,
    'neverhaveiever': nhie,
    'paranoia': paranoia,
    'truth': truth,
    'dare': dare
}


console.log(`Start seeding ...`)

for (const [table, items] of Object.entries(seeders)) {
    console.log(`Seeding ${table}.`)
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        //console.log(`${table} ${i+1}/${items.length}`)
        await prisma[table].upsert({ where: { id: item.id }, create: item, update: item })
    }
}

console.log(`Done seeding!`)



await prisma.$disconnect()

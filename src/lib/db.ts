import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
export default prisma;

export function where(where: object) { return { where } }

export async function FindOrCreateUser(user): Promise<Prisma.User> {
    const u = await prisma.user.upsert({
        where: {
            uid: user.id
        },
        update: { name: user.username },
        create: {
            uid: user.id,
            name: user.username,
            lootTimer: new Date(0),
            guessTimer: new Date(0)
        },
    });
    return u;
}
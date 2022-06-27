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
        update: { name: user.username, discriminator: user.discriminator },
        create: {
            uid: user.id,
            name: user.username,
            discriminator: user.discriminator,
            lootTimer: new Date(0),
            guessTimer: new Date(0)
        },
    });
    return u;
}
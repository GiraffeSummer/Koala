import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
const prisma = new PrismaClient();
export default prisma;

export function where(where: object) { return { where } }

export interface User {
    uid: string;
    name: string | null;
    discriminator: string | null;
    lvl: number | null;
    reputation: number | null;
    toLvl: number | null;
    married: number | null;
    partner: string | null;
    admin: number | null;
    status: string | null;
    timestamp: number | null;
    lvlMessage: string | null;
    bot: number | null;
    selectedBadge: number | null
    balance: number | null;
}
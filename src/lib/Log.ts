import { User } from "@prisma/client";
import prisma, { where, FindOrCreateUser } from "./db";

export async function logCommand(user: string, command: string, options: any | null) {
    return await prisma.commandLog.create({
        data: {
            userId: user,
            command,
            //work on fix later
            options: (options == null) ? null : null//JSON.stringify(options)
        }
    })
}
import { Client } from "discord.js";
import commands, { context_commands } from "../Commands";
import prisma, { where, FindOrCreateUser } from "../lib/db";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }


        //@ts-ignore
        await client.application.commands.set([...commands, ...context_commands]);


        console.log(`${client.user.username} is online`);
    });
};
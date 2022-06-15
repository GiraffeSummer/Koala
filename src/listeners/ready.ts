import { Client } from "discord.js";
import Commands from "../Commands";
import prisma, { where, FindOrCreateUser } from "../lib/db";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        //register badges as choices to select command
        //await registerBadges();
        try {
            await client.application.commands.set(Commands);
        } catch (error) {
            console.error(error);
        }

        console.log(`${client.user.username} is online`);
    });
};

async function registerBadges() {
    //get all badges
    const badges = await prisma.badge.findMany();

    const badgeCommand = Commands.find(b => b.name == 'badge')
    const badgeOption = badgeCommand.options.find(b => b.name == 'select')
    const badgeChoices = badges.map(b => {
        return { name: b.name, value: b.name }
    });
    //@ts-ignore //yes I know, but this is required
    badgeOption.options[0].choices = badgeChoices
}
import { Client } from "discord.js";
import { silentAdd } from "../lib/BadgeSystem"

export default (client: Client): void => {
    client.on("guildCreate", async (guild) => {
        if (!guild) {
            return;
        }
        const owner = await (await guild.fetchOwner()).user;
        await silentAdd(owner, 3);
        //3
        console.log(`joined guild ${guild.name}`);
    });
};
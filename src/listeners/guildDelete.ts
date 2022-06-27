import { Client } from "discord.js";
import { silentRevoke } from "../lib/BadgeSystem"

export default (client: Client): void => {
    client.on("guildDelete", async (guild) => {
        if (!guild) {
            return;
        }
        const owner = await (await guild.fetchOwner()).user;
        await silentRevoke(owner, 3);//remove
        //3
        console.log(`Left guild ${guild.name}`);
    });
};
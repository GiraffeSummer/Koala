import { Client } from "discord.js";
import { silentRevoke } from "../lib/BadgeSystem"
import { Remove as GuildRemove } from '../lib/GuildManager'

export default (client: Client): void => {
    client.on("guildDelete", async (guild) => {
        if (guild == undefined || !guild) {
            return;
        }
        await GuildRemove(guild);

        console.log(`Left guild ${guild?.name || 'unknown'}`);
        try {
            const owner = await (await guild.fetchOwner()).user;
            await silentRevoke(owner, 3);//remove
        } catch (error) {
            console.log('failed to remove owner')
        }
    });
};
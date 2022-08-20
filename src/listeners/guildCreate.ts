import { Client } from "discord.js";
import { silentAdd } from "../lib/BadgeSystem"
import { Add as GuildAdd } from '../lib/GuildManager'

export default (client: Client): void => {
    client.on("guildCreate", async (guild) => {
        if (!guild) {
            return;
        }
        await GuildAdd(guild);

        console.log(`joined guild ${guild.name}`);

        try {
            const owner = await (await guild.fetchOwner()).user;
            await silentAdd(owner, 3);
        } catch (error) {
            console.log('failed to add owner');
        }
    });
};
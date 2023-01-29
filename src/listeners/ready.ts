import { Client, Guild } from "discord.js";
import commands, { context_commands } from "../Commands";
import { CheckStillActiveSharded as CheckGuildsStillActive, filterInactive as RemoveInactiveGuilds } from '../lib/GuildManager'

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        //@ts-ignore
        await client.application.commands.set([...commands, ...context_commands]);

        let [guildCacheSize, guildCacheServersArray] = await Promise.all([
            client.shard.fetchClientValues('guilds.cache.size') as Promise<number[]>,
            client.shard.fetchClientValues('guilds.cache') as Promise<Guild[][]>
        ]);

        guildCacheSize.reduce((acc, guildCount) => acc + guildCount, 0);

        const servers = guildCacheServersArray.reduce((memo, servers) => { return [...memo, ...servers] }, [])
        CheckGuildsStillActive(servers)
        RemoveInactiveGuilds()

        console.log(`${client.user.username} is online [${guildCacheSize} servers]`);
    });
};
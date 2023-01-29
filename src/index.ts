import 'dotenv/config'
import { ShardingManager } from 'discord.js';

const sharding = getShardingEnabled();

if (sharding) {
    const manager = new ShardingManager('./src/bot.ts', { totalShards: 'auto', execArgv: ['-r', 'ts-node/register'], token: process.env.token });

    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

    manager.spawn().catch(() => console.log);
} else {
    import('./bot').then(() => console.log('starting unsharded bot'))
}

export { sharding as sharded }

function getShardingEnabled(): boolean {
    if ('sharding' in process.env) {
        return process.env.sharding == 'true';
    }
    else {
        return true;
    }
}
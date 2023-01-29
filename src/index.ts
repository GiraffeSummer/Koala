import 'dotenv/config'
import { ShardingManager } from 'discord.js';

const sharding = process.env.sharding || true;

if (sharding) {
    const manager = new ShardingManager('./src/bot.ts', { totalShards: 'auto', execArgv: ['-r', 'ts-node/register'], token: process.env.token });

    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

    manager.spawn().catch(() => console.log);
} else {
    import('./bot').then(() => console.log('starting unsharded bot'))
}
import 'dotenv/config'
import { Client, ClientOptions, Intents } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import guildCreate from './listeners/guildCreate';
import guildDelete from './listeners/guildDelete';

import { LoadCommands } from './Commands'

import NumberGuesser from './lib/NumberGuesser';

console.log("Bot is starting...");

//GUILD_MESSAGES
const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});
LoadCommands().then((commands) => {
    //@ts-ignore
    console.log('Commands (' + commands.length + '): ' + commands.map(x => x.name).join(', '))
});

const numberGuesser = new NumberGuesser()
client['numberGuesser'] = numberGuesser;

ready(client);
interactionCreate(client);
guildCreate(client);
guildDelete(client);

client.login(process.env.TOKEN);
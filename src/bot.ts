import 'dotenv/config'
import { Client, ClientOptions } from "discord.js";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";

import { LoadCommands } from './Commands'

console.log("Bot is starting...");

const client = new Client({
    intents: []
});
LoadCommands().then((commands) => {
    console.log('Commands: ' + commands.map(x => x.name).join(', '))
});

ready(client);
interactionCreate(client);

client.login(process.env.TOKEN);
import 'dotenv/config'
import { Client, ClientOptions, Intents } from "discord.js";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

import EventSubscriber from "./lib/EventSubscriber";

import { LoadCommands, LoadContextMenuCommands } from './Commands'

import NumberGuesser from './lib/NumberGuesser';

console.log("Bot is starting...");

//GUILD_MESSAGES
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commandPromise = LoadCommands()

const contextPromise = LoadContextMenuCommands()

Promise.all([commandPromise, contextPromise]).then(async (result) => {
    const [commands, contextCommands] = result;

    console.log('Commands (' + commands.length + '): ' + commands.map(x => x.name).join(', '))
    console.log('Context Commands (' + contextCommands.length + '): ' + contextCommands.map(x => x.name).join(', '))
    await rest.put(
        Routes.applicationCommands(process.env.APPID),
        { body: [...commands, ...contextCommands] },
    );

})

const numberGuesser = new NumberGuesser()
client['numberGuesser'] = numberGuesser;

EventSubscriber(client)

client.login(process.env.TOKEN);
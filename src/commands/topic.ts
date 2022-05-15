import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "topic",
    description: "get a conversation topic",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const count: number = await prisma.topics.count();
        const topic: string = (await prisma.topics.findMany())[RandomNum(count)].topic;

        await interaction.followUp({
            ephemeral: true,
            content: topic
        });
    }
} as Command;
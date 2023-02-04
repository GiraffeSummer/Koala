import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "topic",
    description: "get a conversation topic",
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        const count: number = await prisma.topics.count();
        const topic: string = (await prisma.topics.findFirst({ skip: RandomNum(count), take: 1 })).topic;

        await interaction.followUp({
            content: topic
        });
    }
} as Command;
import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "magic8",
    description: "use a magic8 ball",
    type: "CHAT_INPUT",
    options: [
        {
            type: 'STRING',
            name: 'question',
            description: 'Question to ask the magic8 ball',
            required: true
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const question = interaction.options.get('question')?.value as string || null
        const count: number = await prisma.magic8.count();
        const content: string = (await prisma.magic8.findFirst({ skip: RandomNum(count), take: 1 })).message;

        await interaction.followUp({
            content
        });
    }
} as Command;
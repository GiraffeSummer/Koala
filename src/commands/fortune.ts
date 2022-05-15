import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "fortune",
    description: "Get your fortune told",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const count: number = await prisma.fortune.count();
        const fortune: string = (await prisma.fortune.findMany())[RandomNum(count)].fortune_line;

        await interaction.followUp({
            ephemeral: true,
            content: fortune
        });
    }
} as Command;
import { CommandInteraction, Client ,ApplicationCommandType} from "discord.js";
import { Command } from "../Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "fortune",
    description: "Get your fortune told",
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        const count: number = await prisma.fortune.count();
        const fortune: string = (await prisma.fortune.findFirst({ skip: RandomNum(count), take: 1 })).fortune_line;

        await interaction.followUp({
            content: fortune
        });
    }
} as Command;
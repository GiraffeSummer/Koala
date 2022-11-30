import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "neverhaveiever",
    description: "Play never have I ever",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const count: number = await prisma.neverhaveiever.count();
        const question: string = (await prisma.neverhaveiever.findFirst({ skip: RandomNum(count), take: 1 })).question;

        await interaction.followUp({
            embeds: [{ description: question, color: theme.default }]
        });
    }
} as Command;
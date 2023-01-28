import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "pickup",
    description: "use a bad pickup line",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'find',
        description: 'Look for a specific line'
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const find = interaction.options.get('find')?.value as string || null
        let line = ''
        if (find == null) {
            const count: number = await prisma.pickup.count();
            line = (await prisma.pickup.findFirst({ skip: RandomNum(count), take: 1, where: { includename: false } })).pickup;
        } else {
            line = (await prisma.pickup.findFirst(where({ pickup: { contains: find }, includename: false }))).pickup;
        }
        await interaction.followUp({
            content: line
        });
    }
} as Command;
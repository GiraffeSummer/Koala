import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "pickup",
    description: "use a bad pickup line",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'find',
        description: 'Look for a specific line'
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const find = interaction.options.get('find')?.value as string || null
        let line = ''
        if (find == null) {
            const count: number = await prisma.pickup.count();
            line = (await prisma.pickup.findMany(where({ includename: false })))[RandomNum(count)].pickup;
        } else {
            line = (await prisma.pickup.findFirst(where({ pickup: { contains: find }, includename: false }))).pickup;
        }
        await interaction.followUp({
            content: line
        });
    }
} as Command;
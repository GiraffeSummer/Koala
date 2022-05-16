import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "setstatus",
    description: "use a bad pickup line",
    type: "CHAT_INPUT",
    options: [{
        type: 'STRING',
        name: 'status',
        description: 'Set a new status',
        required: true
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const status = interaction.options.get('status')?.value as string || null

        const line = (await prisma.user.upsert({
            where: { uid: interaction.user.id },
            update: { status },
            create: {
                status,
                uid: interaction.user.id,
                name: interaction.user.username
            },
        }));

        await interaction.followUp({
            ephemeral: true,
            content: 'Status was updated'
        });
    }
} as Command;
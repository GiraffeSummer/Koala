import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where } from "../lib/db";
import * as profanity from '../lib/ProfanityFilter'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "setstatus",
    description: "use a bad pickup line",
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    options: [{
        type: ApplicationCommandOptionType.String,
        name: 'status',
        description: 'Set a new status',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
        const status = interaction.options.get('status')?.value as string || null

        const hasCurseWords = await profanity.check(status)

        if (!hasCurseWords) {
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
        } else {
            await interaction.followUp({
                ephemeral: true,
                content: 'You have illegal words in your status'
            });
        }
    }
} as Command;
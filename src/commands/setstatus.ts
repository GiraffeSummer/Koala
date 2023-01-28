import { CommandInteraction, Client ,ApplicationCommandType,ApplicationCommandOptionType} from "discord.js";
import { Command } from "../Command";
import prisma, { where } from "../lib/db";

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
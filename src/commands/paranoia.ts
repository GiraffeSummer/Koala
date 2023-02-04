import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where } from "../lib/db";
import theme from "../lib/theme";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "paranoia",
    description: "Play paranoia",
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        const count: number = await prisma.paranoia.count();
        const question: string = (await prisma.paranoia.findFirst({ skip: RandomNum(count), take: 1 })).question;

        await interaction.followUp({
            embeds: [{ description: question, color: theme.default, author: { name: interaction.user.username, icon_url: interaction.user.avatarURL() } }],
        });
    }
} as Command;
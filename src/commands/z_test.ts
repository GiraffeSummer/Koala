import { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import { expNeeded, levelUp } from '../lib/LevelSystem'
import Canvas from "../lib/Canvas";
import { Prisma } from "@prisma/client";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "test",
    description: "tesssts",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'user',
            description: 'Which user'
        }
    ],
    disabled: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        const image = await levelUp(user)

        await interaction.followUp({
            content: `${user.accentColor}`,
            files: [new AttachmentBuilder(image).setName('levelup.png')]
        });
    }
} as Command;
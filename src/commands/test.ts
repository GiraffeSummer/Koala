import { BaseCommandInteraction, Client, MessageAttachment } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import { expNeeded, levelUp } from '../lib/LevelSystem'
import Canvas from "../lib/Canvas";
import { Prisma } from "@prisma/client";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "test",
    description: "tesssts",
    type: "CHAT_INPUT",
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'Which user'
        }
    ],
    disabled:true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        const image = await levelUp(user)

        await interaction.followUp({
            content: `${user.accentColor}`,
            files: [new MessageAttachment(image, 'levelup.png')]
        });
    }
} as Command;
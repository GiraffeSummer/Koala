import { BaseCommandInteraction, Client, MessageAttachment } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import { expNeeded } from '../lib/LevelSystem'
import Canvas from "../lib/Canvas";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "rank",
    description: "get a player's rank (WORK IN PROGRESS",
    type: "CHAT_INPUT",
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'Which user'
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;
        const profile = await FindOrCreateUser(user);

        let barValue = (100 / (expNeeded(profile.lvl))) * (expNeeded(profile.lvl) - profile.toLvl);
        const lineColor = "rgb(200, 255, 240)";
        const barColor = "rgb(76, 86, 138)";

        const canvas = new Canvas();

        const img = parseInt(user.discriminator) % 4; //this number should be amount of images
        await canvas.setBackground(`./resources/bg${img}.png`);

        canvas.addBox(20, 20, 896, 242, "rgba(0,0,0,0.7)", 20);

        //Draw avatar circle
        await canvas.addCircleImage(60, 40, 202, user.displayAvatarURL({ format: "jpg", size: 2048 }), 8, lineColor);

        //draw badge
        if (profile.selectedBadge != null) {
            const selectedBadge = await prisma.badge.findFirst({ where: { id: profile.selectedBadge } })
            const badgeExt = 'png'//allow gif too
            const badgeId = selectedBadge.badge.split(':')[2].replace('>', '').trim()
            const badgeURl = `https://cdn.discordapp.com/emojis/${badgeId}.${badgeExt}`
            await canvas.addCircleImage(canvas.canvas.width - 150, 20, 90, badgeURl, 0, lineColor);
        }

        //Draw progress bar
        canvas.addBox(306, 185, 570, 40, barColor, 10, 5, lineColor);
        canvas.addBar(306, 185, 570, 40, 10, lineColor, barValue);

        //Draw text
        canvas.addText(299, 100, user.username, "56px Arial");
        canvas.addText(302, 165, "Level " + profile.lvl, "32px Arial");

        //Draw line
        canvas.addLine(304, 120, 874, 120, 2);

        await interaction.followUp({
            files: [new MessageAttachment(canvas.toBuffer())]
        });
    }
} as Command;
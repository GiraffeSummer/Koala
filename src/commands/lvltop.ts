import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "lvltop",
    description: "Get the top highest levels",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const top = await prisma.user.findMany({ take: 10, orderBy: [{ lvl: 'desc' }, { toLvl: 'asc' }] });

        const embed = new Embed("Top 10:");

        for (let i = 0; i < top.length; i++) {
            const usr = top[i];
            embed.addField(`${usr.name}#${usr.discriminator}`, `Level: ${usr.lvl} with ${usr.toLvl} to go.`)
        }

        await interaction.followUp({
            embeds: embed.get()
        });
    }
} as Command;
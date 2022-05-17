import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import { RandomNum } from "../lib/Functions";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "divorce",
    description: "divorce your partner",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const profile = await FindOrCreateUser(interaction.user);

        if (!profile.married) return await interaction.editReply({ content: 'You are not married.' })

        const partner = await prisma.user.update({ where: { uid: profile.partnerId }, data: { partner: undefined, married: false } })
        await prisma.user.update({ where: { uid: interaction.user.id }, data: { partner: undefined, married: false } })

        await interaction.followUp({
            content: `You and <@${partner.uid}> got divorced! 💔`
        });
    }
} as Command;
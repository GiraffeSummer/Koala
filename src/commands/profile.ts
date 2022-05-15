import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, User } from "../lib/db";
import Embed from '../lib/Embed'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "profile",
    description: "Get your profile",
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

        const profile = await prisma.users.findFirst(where({ uid: user.id }));

        console.log(profile)

        let mess = "";

        let badgeT = ""
        if (profile.selectedBadge) {
            let badge = await prisma.badges.findFirst(where({ id: profile.selectedBadge }))
            badgeT = `\n**Badge:** ${badge.badge} _${badge.name}_`
        }
        if (profile.married == 1) {
            mess += '\n**Married with**: <@' + profile.partner + "> 💍";
        } else { mess += '\n**Married**: ' + 'No'; }

        const embed = new Embed('')
            .setColorRaw(user.accentColor)
            .setThumb(user.avatarURL({ dynamic: true }))
            .addFooter(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setDescription("**Username: **" + profile.name +
                `${badgeT}
                \n**Status:** ` + profile.status +
                '\n**Level:** ' + profile.lvl +
                '\n**To levelup:** ' + profile.toLvl +
                // ` messages${admintxt}` +
                //'\n**Balance:** $' + profile.balance +
                //'\n**Levelup message:** ' + profile.lvlMessage
                mess +
                '');

        await interaction.followUp({
            ephemeral: true,
            embeds: embed.get()
        });
    }
} as Command;
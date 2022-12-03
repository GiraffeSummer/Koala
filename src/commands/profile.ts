import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import Embed from '../lib/Embed'
import theme from '../lib/theme'

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "profile",
    description: "Get your profile",
    type: "CHAT_INPUT",
    ephemeral: true,
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'Which user'
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user);
        const profile = await prisma.user.findFirst({ where: { uid: user.id }, include: { pronouns: { include: { pronouns: true } } } })

        let mess = "";

        let badgeT = ""
        if (profile.selectedBadge) {
            let badge = await prisma.badge.findFirst({ where: { id: profile.selectedBadge } })
            badgeT = `\n**Badge:** ${badge.badge} _${badge.name}_`
        }
        if (profile.married == true) {
            mess += '\n**Married with**: <@' + profile.partnerId + "> 💍";
        } else { mess += '\n**Married**: ' + 'No'; }

        const embed = new Embed('')
            .setColorRaw(user.accentColor || theme.default)
            .setThumb(user.avatarURL({ dynamic: true }))
            .setFooter(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setDescription("**Username: **" + profile.name +
                `\n**Pronouns:** ${(profile.pronouns.length > 0) ?
                    profile.pronouns.map(x => `${x.pronouns.emoji} ${x.pronouns.name}`).join(', ')
                    : 'any/none set'
                }` +
                `${badgeT}
                \n**Status:** ` + profile.status +
                '\n**Level:** ' + profile.lvl +
                '\n**To levelup:** ' + profile.toLvl + ' messages' +
                // `${admintxt}` +
                //'\n**Balance:** $' + profile.balance +
                //'\n**Levelup message:** ' + profile.lvlMessage
                mess +
                '');

        await interaction.followUp({
            embeds: embed.get()
        });
    }
} as Command;
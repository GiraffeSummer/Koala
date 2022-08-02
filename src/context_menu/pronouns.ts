import { BaseCommandInteraction, Client, MessageActionRow, MessageSelectMenu, TextChannel } from "discord.js";
import { Command, ContextCommand } from "../../src/Command";
import prisma, { where, FindOrCreateUser } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "pronouns",
    type: "USER",
    ephemeral: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {  
        const user = interaction.options.get('user')?.user || interaction.user;

        await FindOrCreateUser(user)

        const profile = await prisma.user.findFirst({
            where: { uid: user.id },
            include: { pronouns: { include: { pronouns: true } } }
        });

        const pronounsText = (profile.pronouns.length > 0) ? profile.pronouns.map(x => x.pronouns.name).join(', ') : 'Has not selected any pronouns';
        await interaction.followUp({ ephemeral: true, embeds: [{ title: `${user.username}`, description: `${pronounsText}` }] });
    }
} as ContextCommand;
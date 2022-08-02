import { BaseCommandInteraction, Client } from "discord.js";
import { ContextCommand } from "../Command";
import prisma, { FindOrCreateUser } from "../lib/db";

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
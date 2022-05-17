import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, MessageComponentInteraction } from "discord.js";
import { logCommand } from '../lib/Log'
import { addExp } from '../lib/LevelSystem'
import Commands from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    try {
        logCommand(interaction.user.id, interaction.commandName, (interaction.options['_hoistedOptions'].length > 0) ? interaction.options['_hoistedOptions'] : null)
    } catch (error) { }

    const levelUp = await addExp(interaction.user, slashCommand?.exp || 1);

    await interaction.deferReply();

    if (levelUp.leveled) {
        interaction.followUp({
            ephemeral: true,
            embeds: [{
                color: 0x0000ff,
                description: `You levelled up to level: **${levelUp.user.lvl}**!`,
                title: "**LEVEL UP**"
            }]
        })
    }

    slashCommand.run(client, interaction);
};
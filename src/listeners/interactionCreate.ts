import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, MessageComponentInteraction } from "discord.js";
import { logCommand } from '../lib/Log'
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
    } catch (error) {
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};
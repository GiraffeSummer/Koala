import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, MessageComponentInteraction } from "discord.js";
import { logCommand } from '../lib/Log'
import { addExpInteraction } from '../lib/LevelSystem'
import commands, { context_commands } from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isContextMenu()) {
            await handleContextMenu(client, interaction);
        } else if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const slashCommand = commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    if ((typeof slashCommand.noDefer == 'boolean') ? !slashCommand.noDefer : true) {
        await interaction.deferReply((slashCommand.ephemeral != null) ? { ephemeral: slashCommand.ephemeral || false } : undefined);
    }

    //const levelUp = await addExpInteraction(interaction, slashCommand?.exp || 0);

    try {
        logCommand(interaction.user.id, interaction.commandName, interaction.options.data.map(x => x.value) || null)
    } catch (error) { }

    slashCommand.run(client, interaction);
};

const handleContextMenu = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
    const context_command = context_commands.find(c => c.name === interaction.commandName);
    if (!context_command) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    //const levelUp = await addExp(interaction, context_command?.exp || 1);

    try {
        logCommand(interaction.user.id, interaction.commandName, (interaction.options['_hoistedOptions'].length > 0) ? interaction.options['_hoistedOptions'] : null)
    } catch (error) { }

    if ((typeof context_command.noDefer == 'boolean') ? !context_command.noDefer : true) {
        await interaction.deferReply((context_command.ephemeral != null) ? { ephemeral: context_command.ephemeral || false } : undefined);
    }

    context_command.run(client, interaction);
};
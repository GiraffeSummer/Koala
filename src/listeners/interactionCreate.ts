import { CommandInteraction, ButtonInteraction, Client, Interaction, MessageComponentInteraction, CacheType } from "discord.js";
import { logCommand } from '../lib/Log'
import { FindOrCreateUser } from '../lib/db'
import { addExpInteraction } from '../lib/LevelSystem'
import commands, { context_commands } from "../Commands";
import { HandleTODButtonInteraction, allowedIds as tod_allowed_ids } from "../lib/TruthOrDare"

const buttonInteractionIncludeIds = [...tod_allowed_ids]

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isButton() && buttonInteractionIncludeIds.includes(interaction.customId)) {
            await HandleButtonInteractions(interaction,
                [
                    HandleTODButtonInteraction(client, interaction)
                ])
        }
        else if (interaction.isContextMenuCommand()) {
            await handleContextMenu(client, interaction);
        } else if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

async function HandleButtonInteractions(interaction: ButtonInteraction, interactions: Promise<boolean>[]) {
    Promise.all(interactions).then(async results => {
        if (!results.some(x => x)) {
            await interaction.reply({ ephemeral: true, content: "This message is inactive now, please try the command again." })
        }
    })
}

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    if ((typeof slashCommand.noDefer == 'boolean') ? !slashCommand.noDefer : true) {
        await interaction.deferReply((slashCommand.ephemeral != null) ? { ephemeral: slashCommand.ephemeral || false } : undefined);
    }

    await FindOrCreateUser(interaction.user);
    //const levelUp = await addExpInteraction(interaction, slashCommand?.exp || 0);

    try {
        logCommand(interaction.user.id, interaction.commandName, interaction.options.data.map(x => x.value) || null)
    } catch (error) { }

    slashCommand.run(client, interaction);
};

const handleContextMenu = async (client: Client, interaction: CommandInteraction): Promise<void> => {
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
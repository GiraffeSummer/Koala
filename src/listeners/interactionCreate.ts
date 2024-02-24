import { CommandInteraction, ButtonInteraction, Client, Interaction, MessageComponentInteraction, CacheType } from "discord.js";
import { logCommand } from '../lib/Log'
import { FindOrCreateUser } from '../lib/db'
import { addExpInteraction } from '../lib/LevelSystem'
import commands, { context_commands } from "../Commands";
import { HandleTODButtonInteraction, allowedIds as tod_allowed_ids } from "../lib/TruthOrDare"
import { ButtonInteractionManager } from '../lib/ButtonInteractionListener'

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isButton()) {
            await handleButtonInteraction(client, interaction);
        }
        else if (interaction.isContextMenuCommand()) {
            await handleContextMenu(client, interaction);
        }
        else if (interaction.isAutocomplete()) {
            await handleAutoComplete(client, interaction);
        }
        else if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

async function handleButtonInteraction(client: Client, interaction: ButtonInteraction): Promise<void> {
    const buttonManager = new ButtonInteractionManager(client, interaction);

    if (tod_allowed_ids.includes(interaction.customId)) {
        //truth or dare commands (never have I ever, would you rather, paranoia)
        buttonManager.listen({
            match: (id) => tod_allowed_ids.includes(id),
            execute: HandleTODButtonInteraction,
        })
    } else {
        if (interaction.message?.interaction?.commandName) {
            const command = commands.find(c => c.name === interaction.message.interaction.commandName);
            if ('buttonHandler' in command) {
                buttonManager.listen(command.buttonHandler)
            }
        }
    }
}

async function handleSlashCommand(client: Client, interaction: CommandInteraction): Promise<void> {
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

async function handleContextMenu(client: Client, interaction: CommandInteraction): Promise<void> {
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


async function handleAutoComplete(client: Client, interaction: CommandInteraction): Promise<void> {
    const slashCommand = commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    if ('getAutoCompleteOptions' in slashCommand) {
        const focusedOption = interaction.options.getFocused(true);
        let options = await slashCommand?.getAutoCompleteOptions(client, interaction, focusedOption.value);
        if (options.length > 25) {
            options = options.slice(0, 25);
        } else {
            options = options;
        }
        await interaction.respond(options);
    }
};
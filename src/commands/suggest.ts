import { CommandInteraction, Client, ModalBuilder as Modal, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputStyle, TextInputBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { addExpInteraction } from "../lib/LevelSystem";
import { Command } from "../Command";
import prisma, { where } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "suggest",
    description: "Send in a suggestion",
    type: ApplicationCommandType.ChatInput,
    exp: 0,
    noDefer: true,
    run: async (client: Client, interaction: CommandInteraction) => {

        const modal = new Modal()
            .setCustomId('suggestion_modal')
            .setTitle('Suggestion');

        const titleInput = new TextInputBuilder()
            .setCustomId('title')
            .setLabel("Title")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const textInput = new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel("What's your suggestion")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const firstRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
        const secondRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(textInput);

        modal.addComponents(firstRow, secondRow)


        await interaction.showModal(modal);
        const submit = interaction.awaitModalSubmit({
            filter: (sub) => sub.customId == 'suggestion_modal',
            time: 500 * 1000
        })

        submit
            .then(async (submit) => {
                const suggestion = { title: submit.fields.getTextInputValue('title'), suggestion: submit.fields.getTextInputValue('suggestion') }
                await prisma.suggestions.create({ data: { userId: interaction.user.id, title: suggestion.title, suggestion: suggestion.suggestion } })

                submit.reply({ ephemeral: true, content: 'Thanks for your suggestion, We will look into it!' });
                await addExpInteraction(interaction, 2);
            })
            .catch((err) => {
                interaction.followUp({ ephemeral: true, content: 'Your suggestion did not come through' });
            })
    }
} as Command;
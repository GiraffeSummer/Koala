import { BaseCommandInteraction, Client, Modal, MessageActionRow, ModalActionRowComponent, TextInputComponent, TextChannel, ModalSubmitInteraction } from "discord.js";
import { Command } from "../../src/Command";
import prisma, { where } from "../lib/db";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "suggest",
    description: "Send in a suggestion",
    type: "CHAT_INPUT",
    exp: 2,
    noDefer: true,
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        const modal = new Modal()
            .setCustomId('suggestion_modal')
            .setTitle('Suggestion');

        const titleInput = new TextInputComponent()
            .setCustomId('title')
            .setLabel("Title")
            .setStyle('SHORT');

        const textInput = new TextInputComponent()
            .setCustomId('suggestion')
            .setLabel("What's your suggestion")
            .setStyle('PARAGRAPH');

        const firstRow = new MessageActionRow<ModalActionRowComponent>().addComponents(titleInput);
        const secondRow = new MessageActionRow<ModalActionRowComponent>().addComponents(textInput);

        modal.addComponents(firstRow, secondRow)


        await interaction.showModal(modal);
        const submit: ModalSubmitInteraction = await interaction.awaitModalSubmit({
            filter: (sub) => sub.customId == 'suggestion_modal',
            time: 500 * 1000
        })
        const suggestion = { title: submit.fields.getField('title').value, suggestion: submit.fields.getField('suggestion').value }
        await prisma.suggestions.create({ data: { userId: interaction.user.id, title: suggestion.title, suggestion: suggestion.suggestion } })

        submit.reply({ ephemeral: true, content: 'Thanks for your suggestion, We will look into it!' })
    }
} as Command;
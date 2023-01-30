import { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../Command";
import Paginator from '../lib/ButtonPagination'



//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "pages",
    description: "tesssts",
    type: ApplicationCommandType.ChatInput,
    options: [
    ],
    disabled: true,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        const paginator = new Paginator(interaction, content.length)
        paginator.showPageNumber = true;

        paginator.reply(
            { embeds: [{ title: `${content[0]}` }] },
            (page) => {
                return {
                    embeds: [{ title: `${content[page]}` }]
                }
            }
        )
    }
} as Command;
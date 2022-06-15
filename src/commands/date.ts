import { BaseCommandInteraction, Client, CommandInteractionOption, TextChannel } from "discord.js";
import { Command } from "../Command";
import GenerateDatePicker from '../lib/GenerateDatePickerOptions'

const datePicker = GenerateDatePicker('date-test')

export default {
    name: "date",
    description: "Pick a date",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const channel = await client.channels.fetch(interaction.channelId) as TextChannel;
      await datePicker.start(interaction,channel);
    }
} as Command;

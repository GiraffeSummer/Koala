import { BaseCommandInteraction, Client, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../src/Command";
import Embed from '../lib/Embed'
import CollectorManager from "../lib/CollectorManager";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "test",
    description: "Get someone's avatar",
    type: "CHAT_INPUT",
    options: [],
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        const collector = new CollectorManager(client, interaction);
        await collector.setChannel();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('test_yes')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('invalid')
                    .setLabel('invalid')
                    .setStyle('DANGER')
            );

        //row.components[0].customId

        collector
            .setIds('test_yes', 'test_no')
          //  .getIds(row)
            .createCollector()
            .end(async click => {
                await interaction.editReply({
                    components: [],
                    content: `Done ${click.customId}`
                })
            })


        await interaction.followUp({
            content: `Hello`,
            components: [row]
        });
    }
} as Command;


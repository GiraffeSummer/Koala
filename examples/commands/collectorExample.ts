import { BaseCommandInteraction, Client, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../src/Command";
import CollectorManager from "../lib/CollectorManager";

//just copy and paste this commands, it has a few things pre made so it's easy as template
export default {
    name: "testcollector",
    description: "Testing collector manager",
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
                    .setCustomId('test_other')
                    .setLabel('another')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setCustomId('invalid')
                    .setLabel('invalid')
                    .setStyle('DANGER')
            );

        collector
            //.setIds('test_yes', 'test_no')
            .getIds([row])
            //.rmId('invalid')//remove id from verified
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


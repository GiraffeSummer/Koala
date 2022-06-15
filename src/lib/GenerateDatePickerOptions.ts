import { ChatInputApplicationCommandData, MessageActionRow, MessageButton, TextChannel } from "discord.js";

const months = {
    January: 31,
    February: 29,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
}
export default function (namespace: string = ''): any {
    const picker = {
        namespace: namespace,
        interaction: null,
        channel: null,

        data:{
            month: null,
            day: null,
            year: null,
        },

        init: function (interaction, channel: TextChannel) {
            this.interaction = interaction;
            this.channel = channel;
            return this;
        },
        month: async function (message: string) {
            const rowNum = 12 / 5;
            let rows = []
            for (let r = 0; r < rowNum; r++) {
                const row = new MessageActionRow();
                const subList = Object.keys(months).slice().splice(r * 5, 5)
                for (let i = 0; i < subList.length; i++) {
                    const month = subList[i];
                    row.addComponents(new MessageButton()
                        .setCustomId(`${namespace}-month-${month}`)
                        //.setEmoji(item.symbol)
                        .setLabel(`${month}`)
                        .setStyle("PRIMARY"))
                }
                rows.push(row)
            }
            await this.interaction.followUp({
                content: `${message}`,
                components: rows
            });

            const monthCollect = this.channel.createMessageComponentCollector({
                filter: (int) => this.interaction.user.id === int.user.id,
                componentType: "BUTTON",
                max: 1,
                time: 300 * 1000
            })

            monthCollect.on('end', async (collection) => {
                collection.forEach(async click => {
                    if (!click.customId.startsWith(namespace)) return

                    const Month = click.customId.replace(`${namespace}-month-`, '')
                    this.data.month = Month;

                    await this.interaction.editReply({ components: [], content: `${message}\nYou Picked Month: ${Month}` })
                })
            })
        },
        day: async function (message: string) {

        }
    }
    return picker;
}

function numberToChoiceArray(number: number): Array<any> {
    const opts = []
    for (let i = 1; i <= number; i++) {
        opts.push({ name: i, value: i })
    }
    return opts;
}
import { type Client, type MessageActionRow, type TextChannel, type Interaction, MessageChannelComponentCollectorOptions, ButtonInteraction, SelectMenuInteraction, InteractionCollector } from 'discord.js'

export default class CollectorManager {
    channel: TextChannel;

    client: Client;
    interaction: Interaction

    collector: InteractionCollector<ButtonInteraction | SelectMenuInteraction>;
    ids: string[] = []


    constructor(client: Client, interaction: Interaction) {
        this.client = client;
        this.interaction = interaction;
    };

    async setChannel() {
        this.channel = await this.client.channels.fetch(this.interaction.channelId) as TextChannel;
    }

    setIds(...ids) {
        //possibly scrape ids from MessageActionRow object? 
        this.ids = ids
        return this;
    }

    getIds(row: MessageActionRow) {
        row.components.forEach(component => {
            this.ids.push(component.customId)
        })

        return this;
    }

    createCollector(options: MessageChannelComponentCollectorOptions<ButtonInteraction | SelectMenuInteraction> = {
        filter: (int) => this.interaction.user.id === int.user.id,
        componentType: "BUTTON",
        max: 1,
        time: 300 * 1000
    }) {
        this.collector = this.channel.createMessageComponentCollector({
            filter: (int) => this.interaction.user.id === int.user.id,
            componentType: "BUTTON",
            max: 1,
            time: 300 * 1000
        });

        return this;
    }

    async end(cb: Function) {
        this.collector.on('end', async (collection) => {
            collection.forEach(async click => {
                if (this.ids.includes(click.customId)) await cb(click)
            })
        })

        return this;
    }
    async collect(cb: Function) {
        this.collector.on('collect', async (collection) => {
            //collection.forEach(async click => {
            //    if (Object.keys(this.ids).includes(click.customId)) await cb(click)
            //})
        })

        return this;
    }
    /*
    const collector = channel.createMessageComponentCollector({
        filter: (int) => interaction.user.id === int.user.id,
        componentType: "BUTTON",
        max: 1,
        time: 300 * 1000
    })*/
}
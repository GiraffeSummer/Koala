import {
    type Client, type MessageActionRow, type TextChannel, type Interaction, type MessageChannelComponentCollectorOptions, type CollectorFilter,
    type CacheType, type ButtonInteraction, type SelectMenuInteraction, type InteractionCollector
} from 'discord.js'

export default class CollectorManager {
    #channel: TextChannel;

    #client: Client;
    #interaction: Interaction

    collector: InteractionCollector<ButtonInteraction | SelectMenuInteraction | any>;
    ids: string[] = []


    constructor(client: Client, interaction: Interaction) {
        this.#client = client;
        this.#interaction = interaction;
    };

    async setChannel() {
        this.#channel = await this.#client.channels.fetch(this.#interaction.channelId) as TextChannel;
    }

    setInteraction(interaction: Interaction) {
        this.#interaction = interaction;
        return this;
    }

    setIds(...ids) {
        this.ids = ids
        return this;
    }

    rmId(...ids) {
        this.ids = this.ids.filter(x => !ids.includes(x))
        return this;
    }

    getIds(rows: MessageActionRow[]) {
        rows.forEach(row => {
            row.components.forEach(component => {
                this.ids.push(component.customId)
            })
        })

        return this;
    }

    #collectorOptions:
        MessageChannelComponentCollectorOptions<ButtonInteraction | SelectMenuInteraction> =
        {
            filter: (int) => this.#interaction.user.id === int.user.id,
            componentType: "BUTTON",
            max: 1,
            time: 300 * 1000
        };

    setTimeOut(minutes: number) {
        this.#collectorOptions.time = minutes * 60 * 1000;
        return this;
    }

    setMax(max: number) {
        this.#collectorOptions.max = max;
        return this;
    }

    setFilter(filter: CollectorFilter<[ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>]> | null) {
        this.#collectorOptions.filter = filter;
        return this;
    }

    setComponentType(type: ComponentTypes) {
        this.#collectorOptions.componentType = type;
        return this;
    }

    createCollector(options: MessageChannelComponentCollectorOptions<ButtonInteraction | SelectMenuInteraction | any> = this.#collectorOptions) {
        this.collector = this.#channel.createMessageComponentCollector(options);

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
        this.collector.on('collect', async (click) => {
            if (Object.keys(this.ids).includes(click.customId)) await cb(click)
        })

        return this;
    }
}

export enum ComponentTypes {
    BUTTON = "BUTTON",
    ACTION_ROW = "ACTION_ROW",
    SELECT_MENU = "SELECT_MENU",
    TEXT_INPUT = "TEXT_INPUT"
}
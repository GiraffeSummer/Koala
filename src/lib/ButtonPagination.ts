import { CommandInteraction, InteractionCollector, InteractionReplyOptions, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";

export default class Paginator {

    public interaction: CommandInteraction
    public maxPages: number;
    public timeoutSeconds: number = 1 * 60;
    public showPageNumber: boolean = false;

    private pageNext = 'page-next'
    private pagePrevious = 'page-prev'
    private pageNumber = 'pagenum'

    private collector: InteractionCollector<any>

    constructor(interaction: CommandInteraction, maxPages: number = 5) {
        this.interaction = interaction;
        this.maxPages = maxPages;
    }

    async reply(initialContent: InteractionReplyOptions, onCollect: (page: number) => InteractionReplyOptions) {
        const reply = await this.interaction.followUp({
            ...initialContent,
            components: [this.buttonBuilder(0)]
        });
        const collector = reply.createMessageComponentCollector({
            filter: (i) => {
                return i.user.id == this.interaction.user.id
            },
            time: this.timeoutSeconds * 1000
        });
        this.collector = collector;

        this.collect(onCollect)

        collector.on('end', async () => {
            await reply.edit({ components: [] })
        })
    }

    private collect(contentFn: (page: number) => InteractionReplyOptions) {
        this.collector.on('collect', async i => {
            let page = 0;
            if (i.customId.startsWith(this.pageNext)) {
                page = parseInt(i.customId.slice(this.pageNext.length))
            } else if (i.customId.startsWith(this.pagePrevious)) {
                page = parseInt(i.customId.slice(this.pagePrevious.length))
            }
            const content = contentFn(page)
            i.update({
                ...content,
                components: [this.buttonBuilder(page)]
            })
        });
    }


    private buttonBuilder(page: number = 0) {
        const row = new ActionRowBuilder<ButtonBuilder>();
        if (page > 0) {
            row.addComponents(new ButtonBuilder()
                .setCustomId(this.pagePrevious + `${page - 1}`)
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Primary))
        }
        if (this.showPageNumber) {
            row.addComponents(new ButtonBuilder()
                .setCustomId(this.pageNumber)
                .setLabel(`${page}/${this.maxPages - 1}`)
                .setDisabled(true)
                .setStyle(ButtonStyle.Danger));
        }
        if (page + 1 < this.maxPages) {
            row.addComponents(new ButtonBuilder()
                .setCustomId(this.pageNext + `${page + 1}`)
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Primary));
        }

        return row;
    }
}


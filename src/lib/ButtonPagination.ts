import {
    CommandInteraction,
    InteractionCollector,
    InteractionReplyOptions,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Message,
    MessageComponentInteraction,
} from "discord.js";

export default class Paginator {

    public timeoutSeconds: number = 1 * 60;
    public showPageNumber: boolean = false;

    private maxPages: number;
    private interaction: CommandInteraction
    private currentPage: number = 0;

    private pageNext = 'page-next'
    private pagePrevious = 'page-prev'
    private pageNumber = 'pagenum'

    public customCollect?: (i: MessageComponentInteraction) => Promise<void>;

    private collector: InteractionCollector<any>
    private reply: Message<boolean>

    constructor(interaction: CommandInteraction, maxPages: number = 5) {
        this.interaction = interaction;
        this.maxPages = Math.ceil(maxPages);
    }

    public static paginateArray<T>(array: Array<T>, page: number, pageSize: number = 5): Array<T> {
        return array.slice().splice(page * pageSize, pageSize)
    }

    async init(onCollect: (page: number) => InteractionReplyOptions) {
        const initialContent = onCollect(this.currentPage)

        const initialComponents = (typeof initialContent?.components === typeof []) ? initialContent.components : [];

        const reply = await this.interaction.followUp({
            ...initialContent,
            components: (this.maxPages > 1) ? [this.buttonBuilder(this.currentPage), ...initialComponents].slice(0, 5) : initialComponents
        });
        this.reply = reply;
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
        return { reply, collector }
    }

    private collect(contentFn: (page: number) => InteractionReplyOptions) {
        this.collector.on('collect', async i => {
            let page = this.currentPage;
            if (i.customId.startsWith(this.pageNext)) {
                page = parseInt(i.customId.slice(this.pageNext.length))
            } else if (i.customId.startsWith(this.pagePrevious)) {
                page = parseInt(i.customId.slice(this.pagePrevious.length))
            }
            if (i.customId.startsWith(this.pageNext) || i.customId.startsWith(this.pagePrevious)) {
                if (page != this.currentPage) {
                    this.currentPage = page;
                    const content = contentFn(page)
                    const components = (typeof content?.components === typeof []) ? content.components : [];
                    i.update({
                        ...content,
                        components: (this.maxPages > 1) ? [this.buttonBuilder(page), ...components].slice(0, 5) : components
                    })
                }
            } else {
                if (this.customCollect)
                    await this.customCollect(i)
            }
        });
    }


    private buttonBuilder(page: number) {
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
                .setLabel(`${page + 1}/${this.maxPages}`)
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


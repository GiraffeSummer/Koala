interface Image { url: string }

interface Field {
    name: string;
    value: string;
    inline: boolean
}

interface Author {
    name: string;
    url: string;
    icon_url: string;
}

interface Footer {
    icon_url: string;
    text: string;
}

export default class Embed {
    title: string | null;
    image: Image | null;
    thumbnail: Image | null;
    description: string | null;
    author: Author | null;
    timestamp: number | null;
    url: string | null;

    color: number | null

    footer: Footer | null;

    fields: Field[] | null = [];

    constructor(title: string = null) {
        this.title = title;
    }

    addField(name: string,
        value: string,
        inline: boolean = false) {
        this.fields = [...this.fields, { name, value, inline }]
        return this;
    }

    setColor(hex: string) {
        if (hex.startsWith('#')) hex = hex.substring(1)
        const color = hex.substring(0, 2) + hex.substring(2, 4) + hex.substring(4, 6);
        this.color = parseInt(color, 16);
        return this;
    }

    setColorRaw(col: number) {
        this.color = col;
        return this;
    }

    setAuthor(name: string,
        url: string,
        icon_url: string) {
        this.author = { name, url, icon_url }
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }

    setTimestamp(timestamp: number = Date.now()) {
        this.timestamp = timestamp;
        return this;
    }

    setFooter(text: string, icon_url: string | null = null) {
        this.footer = { text, icon_url }
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setImage(image: string | null) {
        this.image = { url: image }
        return this;
    }

    setThumb(image: string | null) {
        this.thumbnail = { url: image };
        return this;
    }

    get() {
        return [this]
    }
}
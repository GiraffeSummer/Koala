const Canvas = require("canvas");
const Discord = require("discord.js");

export default class DiscordCanvas {
    canvas: any;
    context: any;
    constructor(w: number = 936, h: number = 282) {
        //Canvas.registerFont("./resources/fonts/arial.ttf", { family: "Arial" });
        //Canvas.registerFont("./resources/fonts/ariblk.ttf", { family: "Arial Black" });
        this.canvas = Canvas.createCanvas(w, h);
        this.context = this.canvas.getContext("2d");
    }

    async setBackground(url) {
        const background = await Canvas.loadImage(url);
        const scale = Math.max(
            this.canvas.width / background.width,
            this.canvas.height / background.height
        );

        this.context.drawImage(
            background,
            this.canvas.width / 2 - (background.width / 2) * scale,
            this.canvas.height / 2 - (background.height / 2) * scale,
            background.width * scale,
            background.height * scale
        );
    }

    /** Draw line */
    addLine(ax, ay, bx, by, lWidth = 2, lColor = "white") {
        this.context.strokeStyle = lColor;
        this.context.lineWidth = lWidth;
        this.context.beginPath();
        this.context.lineTo(ax, ay);
        this.context.lineTo(bx, by);
        this.context.stroke();
    }

    addBox(x, y, width, height, color, radius = 0, lWidth = 0, lColor = "white") {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(x + radius, y);
        this.context.arcTo(x + width, y, x + width, y + height, radius);
        this.context.arcTo(x + width, y + height, x, y + height, radius);
        this.context.arcTo(x, y + height, x, y, radius);
        this.context.arcTo(x, y, x + width, y, radius);

        if (lWidth > 0) {
            this.context.lineWidth = lWidth;
            this.context.strokeStyle = lColor;
            this.context.stroke();
        }
        this.context.fillStyle = color;
        this.context.fill();
        this.context.restore();
    }

    async addImage(x, y, width, height, url) {
        const img = await Canvas.loadImage(url);
        this.context.drawImage(img, x, y, width, height);
    }

    async addCircleImage(x, y, size, url, lWidth = 0, lColor = "white") {
        const img = await Canvas.loadImage(url);
        this.context.save();
        this.context.beginPath();
        this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI, false);
        if (lWidth > 0) {
            this.context.lineWidth = lWidth;
            this.context.strokeStyle = lColor;
            this.context.stroke();
        }
        this.context.clip();
        this.context.drawImage(img, x, y, size, size);
        this.context.restore();
    }

    addText(x, y, text, font = "18px Arial", color = "white") {
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }

    /** Progress bar */
    addBar(x, y, width, height, radius = 0, color = "white", percentage = 100) {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(x + radius, y);
        this.context.arcTo(x + width, y, x + width, y + height, radius);
        this.context.arcTo(x + width, y + height, x, y + height, radius);
        this.context.arcTo(x, y + height, x, y, radius);
        this.context.arcTo(x, y, x + width, y, radius);
        this.context.clip();

        this.context.fillStyle = color;
        this.context.fillRect(x, y, (width * percentage) / 100, height);
        this.context.restore();
    }

    toBuffer() {
        return this.canvas.toBuffer();
    }

    toAttachment(fileName = "canvas.jpg") {
        return new Discord.MessageAttachment(this.toBuffer(), fileName);
    }
};

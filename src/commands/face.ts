import { BaseCommandInteraction, Client, MessageAttachment } from "discord.js";
import fetch, { METHODS } from '../lib/fetch'
import { Command } from "../Command";
import { createCanvas, loadImage } from 'canvas'
import Embed from '../lib/Embed'

function FileInfo(image: string) {
    return {
        "api_key": 'd45fd466-51e2-4701-8da8-04351c872236',
        "file_uri": image,
        "detection_flags": "basicpoints,propoints,classifiers,content",
        "recognize_targets": [],
        "original_filename": "sample.png"
    }
}

export default {
    name: "face",
    description: "Face recognition",
    type: "CHAT_INPUT",
    options: [{
        type: 'ATTACHMENT',
        name: 'image',
        description: 'Image with a face in it (real faces work best)',
        required: true
    }],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const attachment = interaction.options.get('image')?.attachment || null;
        if (attachment == null) return;

        const postData = FileInfo(attachment.url);

        const body: any = (await fetch('https://www.betafaceapi.com/api/v2/media', {
            method: METHODS.POST,
            //@ts-ignore
            data: postData,
            headers: {
                'Content-Type': 'application/json',
                //@ts-ignore
                'accept': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
        })).data

        let tags = body.media.faces[0].tags;

        let desc: string = "";
        for (let i = 0; i < tags.length; i++) {
            let name = tags[i].name;
            let val = tags[i].value;
            if (name == "attractive" || val !== "no")
                desc += `**${name}**: ${val} \n`
        }

        let face = body.media.faces[0]
        //draw stupid rectangle
        loadImage(attachment.url).then(async (image) => {
            const canvas = createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0)
            ctx.lineWidth = 5;
            ctx.strokeStyle = "limegreen";
            ctx.beginPath();
            ctx.rect(face.x - (face.width / 2), face.y - (face.height / 2), face.width, face.height);
            ctx.stroke();

            const embed = new Embed(attachment.name)
                .setColor('4169e1').setDescription(desc).setThumb('attachment://file.jpg')//attachment.url)

            await interaction.followUp({
                ephemeral: true,
                embeds: embed.get(),
                files: [new MessageAttachment(canvas.toBuffer())]
            });
        })
    }
} as Command;
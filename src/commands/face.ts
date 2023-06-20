import { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import fetch, { METHODS } from '../lib/fetch'
import { Command } from "../Command";
import { createCanvas, loadImage } from 'canvas'
import theme from '../lib/theme'

export default {
    name: "face",
    description: "Face recognition",
    type: ApplicationCommandType.ChatInput,
    options: [{
        type: ApplicationCommandOptionType.Attachment,
        name: 'image',
        description: 'Image with a face in it (real faces work best)',
        required: true
    }],
    run: async (client: Client, interaction: CommandInteraction) => {
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
        if (body.media.faces == null) {
            return await interaction.followUp({
                embeds: [{ title: 'No face found', color: theme.error, description: 'Does the image have a (real) face?'}],
            });
        }
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

            const embed = { title: attachment.name, color: 0x4169e1, description: desc, thumbnail: { url: 'attachment://file.jpg' } }

            await interaction.followUp({
                embeds: [embed],
                files: [new AttachmentBuilder(canvas.toBuffer())]
            });
        })
    }
} as Command;


function FileInfo(image: string) {
    return {
        "api_key": 'd45fd466-51e2-4701-8da8-04351c872236',
        "file_uri": image,
        "detection_flags": "basicpoints,propoints,classifiers,content",
        "recognize_targets": [],
        "original_filename": "sample.png"
    }
}
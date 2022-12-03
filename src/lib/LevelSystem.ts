import prisma, { where, FindOrCreateUser } from "../lib/db";
import { Message, BaseCommandInteraction as Interaction, User } from 'discord.js';
import Canvas from "../lib/Canvas";
import theme from "../lib/theme";

const levelMessages = true;

export async function addExpInteraction(interaction: Interaction, exp: number = 1, userOb: any = null) {

    const { user, leveled } = await addExp(userOb || interaction.user, exp);

    if (leveled && levelMessages) {
        try {
            interaction.followUp({
                ephemeral: true,
                files: [await levelUp(userOb || interaction.user)]
            })
        } catch (error) {
            interaction.followUp({
                embeds: [{ color: theme.default, title: "**LEVEL UP**", description: `You levelled up to level: **${user.lvl}**!`, footer: { text: `Annoying message?\nuse /suggest, I'll fix this soon. (also enable attach file permission)` } }],
            })
        }
    }

    return { user, leveled }
}

export async function addExpMessage(message: Message, exp: number = 1, userOb: any = null) {

    const { user, leveled } = await addExp(userOb || message.author, exp);

    if (leveled && levelMessages) {
        try {
            message.reply({
                files: [await levelUp(userOb || message.author)]
            })
        } catch (error) {
            message.reply({
                embeds: [{ color: theme.default, title: "**LEVEL UP**", description: `You levelled up to level: **${user.lvl}**!`, footer: { text: `Annoying message?\nuse /suggest, I'll fix this soon. (also enable attach file permission)` } }],
            })
        }
    }

    return { user, leveled }
}

//@ts-ignore
export async function levelUp(user: User) {
    const profile = await FindOrCreateUser(user);

    const canvas = new Canvas();

    const img = parseInt(user.discriminator) % 4; //this number should be amount of images
    await canvas.setBackground(`./resources/bg${img}.png`);

    canvas.addBox(20, 20, 896, 242, "rgba(0,0,0,0.7)", 40);

    //Draw avatar circle
    await canvas.addCircleImage(60, 40, 202, user.displayAvatarURL({ format: "jpg", size: 2048 }), 8, 'rgba(0,0,0,0.7)');

    //Draw text
    canvas.addText(302, 110, `Leveled up to: ${profile.lvl}`, "56px Comfortaa");
    canvas.addText(302, 200, `${user.username}#${user.discriminator}`, "48px Comfortaa");

    //Draw line
    canvas.addLine(304, canvas.height / 2, 874, canvas.height / 2, 2);
    return canvas.toBuffer();
}
export async function addExp(userOb: User, exp = 1) {
    let leveled = false;

    let user = await FindOrCreateUser(userOb);

    let newExp = user.toLvl - exp;
    if (newExp <= 0) {
        leveled = true;
        newExp = expNeeded(user.lvl) - (-newExp)
    }

    user = await prisma.user.update({
        where: { uid: user.uid }, data: {
            lvl: (leveled) ? user.lvl + 1 : user.lvl,
            toLvl: newExp
        }
    })
    return { user, leveled }
}

export function expNeeded(lvl: number): number {
    return (lvl + 1) * 10 + 10
}
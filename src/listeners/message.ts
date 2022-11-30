import { Client } from "discord.js";
import { addExpMessage } from '../lib/LevelSystem'

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        if (!message) {
            return;
        }
        //ignore webhooks and bots
        if (message.author.bot || message.webhookId) {
            return;
        }
        const levelUp = await addExpMessage(message, 1);
    });
};
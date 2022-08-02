import fs from "fs";
import { Client } from "discord.js";

export default async function Subscribe(client: Client) {
    try {
        const files = fs.readdirSync("./src/listeners/")

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.endsWith(".ts")) return;

            const event = (await import(`../listeners/${file}`)).default;
            event(client);
        }
    } catch (err) {
        console.log(`Error while loading events. ${err}`);
    }

}
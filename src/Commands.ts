import { Command } from "./Command";
import fs from "fs";

let commands: Command[] = [];

export async function LoadCommands() {
    try {
        const files = fs.readdirSync("./src/commands/")

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.endsWith(".ts")) return;

            const command = (await import(`./commands/${file}`)).default;

            if (true /*if enabled*/) {
                commands.push(command);
            }
        }
        return commands
    } catch (err) {
        console.log(`Error while loading commands. ${err}`);
    }

}

export default commands;
//export const Commands: Command[] = [Hello, Gif];
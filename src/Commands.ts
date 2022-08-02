import { Command, ContextCommand } from "./Command";
import fs from "fs";

let commands: Command[] = [];
let context_commands: ContextCommand[] = [];

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

export async function LoadContextMenuCommands() {
    try {
        const files = fs.readdirSync("./src/context_menu/")
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.endsWith(".ts")) return;
            const command = (await import(`./context_menu/${file}`)).default;

            if (true /*if enabled*/) {
                context_commands.push(command);
            }
        }
        return context_commands
    } catch (err) {
        console.log(`Error while loading context commands. ${err}`);
    }
}
export { context_commands };
export default commands;
//export const Commands: Command[] = [Hello, Gif];
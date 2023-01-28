import {  ApplicationCommandType,  } from "discord.js";
import { ContextCommand } from "../Command";
import _command from '../commands/profile'

export default {
    name: "profile",
    type: ApplicationCommandType.User,
    run: _command.run
} as ContextCommand;
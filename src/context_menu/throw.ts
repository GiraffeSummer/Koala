import { ContextCommand } from "../Command";
import _command from '../commands/throw'

export default {
    name: "throw",
    type: "USER",
    ephemeral: true,

    run: _command.run
} as ContextCommand;
import { ContextCommand } from "../Command";
import _command from '../commands/profile'

export default {
    name: "profile",
    type: "USER",
    run: _command.run
} as ContextCommand;
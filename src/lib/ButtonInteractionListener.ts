import { ButtonInteraction, Client, } from "discord.js";

export interface ButtonInteractionListener {
    /**
     * Verifies if it should listen to this customId
     * @param customId 
     * @returns 
     */
    match: (customId) => boolean;
    /**
     * Function that runs to handle the button interaction
     * @param client 
     * @param interaction 
     * @returns 
     */
    execute: (client: Client, interaction: ButtonInteraction) => Promise<boolean>;
    /**
     * Function to more finely filter the button interactions
     * @param interaction 
     * @returns 
     */
    filter?: (interaction: ButtonInteraction) => boolean;
    /**
     * Maximum age a message may be to handle the button
     */
    maxAgeMs?: number;
}

export class ButtonInteractionManager {
    client: Client;
    interaction: ButtonInteraction;

    constructor(client: Client, interaction: ButtonInteraction) {
        this.client = client;
        this.interaction = interaction;
    }
    async listen(listener: ButtonInteractionListener) {
        const matches = listener.match(this.interaction.customId);
        if (!matches) return false

        if ('filter' in listener) {
            const filtered = !listener.filter(this.interaction);
            if (filtered) return false;
        }

        if (listener.maxAgeMs != null) {
            const maxMsgAge = listener.maxAgeMs //?? 30 * 60 * 1000;
            const msgAge = new Date().getTime() - this.interaction.message.createdTimestamp
            if (maxMsgAge < msgAge) {
                this.interaction.reply({ ephemeral: true, content: 'This message is too old,\nPlease try the command again!' })
                return false;
            }
        }

        return listener.execute(this.client, this.interaction);
    }
}
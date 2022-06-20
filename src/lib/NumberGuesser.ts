
import { User } from "discord.js";
import prisma, { where, FindOrCreateUser } from "../lib/db";
import { addExp } from '../lib/LevelSystem'
export default class NumberGuess {
    #number: number;
    readonly #maxNumber: number = 100;

    guesses: Guess[];
    reward: Reward;//badgeId = NUll for no badge reward

    constructor(reward: Reward = { exp: 3, badgeId: 8 }) {
        this.reward = reward;

        this.guesses = [];
        this.#Generate();
    }

    Reset() {
        this.guesses = [];
        this.#Generate();
    }

    Guess(number: number) {
        if (this.#number === number) {
            return true;
        } else {
            this.guesses.push({
                number
            })
            return false;
        }
    }
    //@ts-ignore
    async Reward(user: User, interaction: any) {
        addExp(interaction, this.reward.exp);

        if (this.reward.badgeId !== null) {
            const alreadyHas = await prisma.badge_inventory.findFirst({
                where: {
                    badgeid: this.reward.badgeId,
                    userid: user.id,
                }
            })

            const badge = await prisma.badge.findFirst(where({ id: this.reward.badgeId }))
            if (alreadyHas == null) {
                await prisma.badge_inventory.upsert({
                    where: {
                        userid_badgeid: {
                            badgeid: this.reward.badgeId,
                            userid: user.id,
                        }
                    },
                    create: {
                        userid: user.id,
                        badgeid: this.reward.badgeId
                    }, update: {}
                });
                interaction.followUp({ content: `You earned the ${badge.badge} \`${badge.name}\` badge!`, ephemeral: true })
            } else {
                interaction.followUp({ content: `You already have ${badge.badge} \`${badge.name}\``, ephemeral: true })
            }
        }
    }

    #Generate() {
        this.#number = this.#RandomNum(this.#maxNumber);
        console.log(`Generated ${this.#number}`)
    }
    #RandomNum(max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
export interface Reward {
    exp: number;
    badgeId: number | null;
}
export interface Guess {
    number: number;
}
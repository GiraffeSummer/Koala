import RewardManager from '../lib/RewardManager'
export default class NumberGuess {
    #number: number;
    readonly #maxNumber: number = 100;

    guesses: Guess[];
    rewardId: Number = 2;

    constructor() {

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
    async Reward(interaction: any) {
        return await RewardManager(interaction, this.rewardId);
    }

    #Generate() {
        this.#number = this.#RandomNum(this.#maxNumber);
        console.log(`Generated ${this.#number}`)
    }
    #RandomNum(max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export interface Guess {
    number: number;
}
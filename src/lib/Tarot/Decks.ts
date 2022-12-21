import { Card } from './Tarot'
import path from 'path'

const basePath = path.join(process.cwd(), `/src/lib/Tarot/decks/`);

//This is used to "easily" map different images to the same cards
export class Deck {
    name: string
    ranks: Ranks
    suits: Suits

    constructor(name: string, suits: Suits, ranks: Ranks) {
        this.name = name;
        this.suits = suits;
        this.ranks = ranks;
    }

    public filename(card: Card) {
        const rank = typeof card.rank == 'string' ? this.ranks[card.rank] : card.rank.toString().padStart(2, '0')
        return path.join(basePath, `${this.name}/${card.suit}/sm_RWSa-${this.suits[card.suit]}-${rank}.png`);
    }
}

//declare so it can be used independently
export const mainDeck = new Deck('main', {
    coins: 'P',
    cups: "C",
    major: "T",
    swords: "S",
    wands: "W",
}, {
    king: "KI",
    queen: "QU",
    knight: "J1",
    page: "J2"
})

//list with all the decks
export const decks = {
    'main': mainDeck
}

export interface Ranks {
    king: string,
    queen: string,
    knight: string,
    page: string,
}

export interface Suits {
    major: string,
    wands: string,
    cups: string,
    swords: string,
    coins: string,
}
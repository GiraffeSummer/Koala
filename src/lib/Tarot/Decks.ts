import { Card } from './Tarot'
import path from 'path'

const basePath = path.join(process.cwd(), `/resources/Tarot/decks/`);

//folder name, lowercase, snake_case

//This is used to "easily" map different images to the same cards
export class Deck {
    name: string
    ranks: Ranks
    suits: Suits

    path: string;
    filename: (Card) => string;

    constructor(name: string, suits: Suits, ranks: Ranks, fileName: (Card) => string) {
        this.name = name;
        this.suits = suits;
        this.ranks = ranks;

        this.path = path.join(basePath, `${this.name.toLowerCase().replaceAll(' ', '_')}`);
        this.filename = fileName;
    }
}

//declare so it can be used independently
export const mainDeck = new Deck('Rider Waite', {
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
}, function (card: Card) {
    const rank = typeof card.rank == 'string' ? this.ranks[card.rank] : card.rank.toString().padStart(2, '0')
    return path.join(this.path, `/${card.suit}/sm_RWSa-${this.suits[card.suit]}-${rank}.png`);
})

//list with all the decks
export const decks = {
    'main': mainDeck,
    'visconti': new Deck('Visconti', {
        coins: 'coins',
        cups: "cups",
        major: "major",
        swords: "swords",
        wands: "wands",
    }, {
        king: "k",
        queen: "q",
        knight: "kn",
        page: "p"
    }, function (card: Card) {
        const rank = typeof card.rank == 'string' ? this.ranks[card.rank] : card.rank.toString()
        return path.join(this.path, `/${card.suit}/${rank}.jpg`);
    })
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
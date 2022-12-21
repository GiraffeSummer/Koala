import interpretation from './interpretation'
import { Deck, decks, mainDeck } from './Decks'
export const defaultDeckName = 'main'

const interpretations = interpretation as Card[];

//main function
export default async function (type: CardType = CardType.All, deckName: string = defaultDeckName) {
    if (!interpretations) {
        throw new Error('Interpretations not found!!!');
    }
    //deck is to map images to card interpretations
    let deck: Deck = decks[deckName];
    if (!deck) {
        console.warn('Deck not found, using main')
        deck = mainDeck;
    }

    const filter = (type == CardType.All) ? () => true :
        (
            (type == CardType.Major) ?
                (card) => { return card.suit == "major" }
                : //minor:
                (card) => { return card.suit != "major" }
        );

    const cards = interpretations.filter(filter)
    const card: Card = cards.random();
    card.image = deck.filename(card);
    return card;
}

export interface Card {
    fortune_telling: string[]
    keywords: string[]
    meanings: { light: string[], shadow: string[] }
    name: string
    rank: 'king' | 'queen' | 'knight' | 'page' | number
    suit: Suits
    image?: any
}

export enum Suits {
    Major = 'major',
    Wands = 'wands',
    Cups = 'cups',
    Swords = 'swords',
    Coins = 'coins',
}

export enum CardType {
    All,
    Major,
    Minor,
}

import interpretation from './interpretation'
import { Deck, tryDeck } from './Decks'
export const defaultDeckName = 'main'

const interpretations = interpretation;

//main function
export default async function (type: CardType = CardType.All, deckName: string = defaultDeckName) {
    if (!interpretations) {
        throw new Error('Interpretations not found!!!');
    }
    //deck is to map images to card interpretations
    let deck: Deck = tryDeck(deckName)

    const cards = (type == CardType.All) ? interpretations :
        interpretations.filter((type == CardType.Major) ?
            (card) => { return card.suit == "major" }
            : //minor:
            (card) => { return card.suit != "major" }
        );
    const card: Card = cards.random() as Card;
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

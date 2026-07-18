import { writeFileSync } from "fs";
import ollama from "../src/lib/ollama";
import { generatePrompt, ReadingMode, ReadingPosition, positionPrompts } from "../src/lib/Tarot/generatePrompt";
import cards from "../src/lib/Tarot/interpretation"
import { Card } from "../src/lib/Tarot/Tarot";

const readingModes: ReadingMode[] = ['mixed', 'light', 'shadow']
const preGenerateAmount = 5;

async function main() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responsesGenerated = 0;
    const mainObject: any = {}
    const positions = Object.keys(positionPrompts)
    const positionAmount = positions.length

    const generateReading = async (card: Card, style: ReadingMode, position: ReadingPosition) => {
        const response = await ollama(generatePrompt(card, style, position), 'qwen3:4b-instruct');
        if (response.success == true)
            return response.response
        else if (response.success == false) throw new Error(response.msg)
    }
    const save = (obj) => {
        console.log('writing ', Object.keys(obj).length, 'of', cards.length)
        writeFileSync('./resources/Tarot/readings.json', JSON.stringify(obj, undefined, 4))
    }

    console.time('Generated in')

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!(card.name in mainObject)) mainObject[card.name] = {}
        console.log(`Starting: ${card.name}`)
        for (let y = 0; y < readingModes.length; y++) {
            const style = readingModes[y];

            console.log(`in style: ${style}`)
            for (let p = 0; p < positionAmount; p++) {
                const position = positions[p];
                if (!(position in mainObject[card.name])) mainObject[card.name][position] = {}
                if (!(style in mainObject[card.name][position])) mainObject[card.name][position][style] = []

                console.log(`in position: ${position}`)

                for (let r = 0; r < preGenerateAmount; r++) {
                    console.log(`${r}/${preGenerateAmount} (total: ${responsesGenerated})`)
                    try {
                        const reading = await generateReading(card as Card, style, position as ReadingPosition)
                        mainObject[card.name][position][style].push(reading)
                        responsesGenerated++
                    } catch (error) {
                        console.log(`Issue "${(error as Error).message}" with: ${card.name} ${style} ${r}/${preGenerateAmount}`)
                        // i--;
                        // y--;
                        r--;
                    }
                }
                save(mainObject)
            }
        }
        console.log(`Done: ${card.name} (${i}/${cards.length})`)
    }
    console.timeEnd('Generated in')
    save(mainObject)
    console.log('Written! total responses: ' + responsesGenerated)
}
main().then(() => console.log('done')).catch(e => console.error(e))
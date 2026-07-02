import { writeFileSync } from "fs";
import ollama from "../src/lib/ollama";
import { generatePrompt, ReadingMode } from "../src/lib/Tarot/generatePrompt";
import cards from "../src/lib/Tarot/interpretation"
import { Card } from "../src/lib/Tarot/Tarot";
const readingModes: ReadingMode[] = ['mixed', 'light', 'shadow']
const preGenerateAmount = 5;
async function main() {
    let mainObject = {}

    const generateReading = async (card: Card, style: ReadingMode) => {
        const response = await ollama(generatePrompt(card, style));
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
            if (!(style in mainObject[card.name])) mainObject[card.name][style] = []

            console.log(`in style: ${style}`)
            for (let r = 0; r < preGenerateAmount; r++) {
                console.log(`${r}/${preGenerateAmount}`)
                try {
                    const reading = await generateReading(card as Card, style)
                    mainObject[card.name][style].push(reading)
                } catch (error) {
                    console.log(`Issue "${(error as Error).message}" with: ${card.name} ${style} ${r}/${preGenerateAmount}`)
                    // i--;
                    // y--;
                    r--;
                }
            }
        }
        console.log(`Done: ${card.name} (${i}/${cards.length})`)
        save(mainObject)
    }
    console.timeEnd('Generated in')
    save(mainObject)
    console.log('Written!')
}
main().then(() => console.log('done')).catch(e => console.error(e))
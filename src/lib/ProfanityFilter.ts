import { ProfanityEngine } from '@coffeeandfun/google-profanity-words';

const profanity = new ProfanityEngine();
export function check(text: string) {
    return profanity.hasCurseWords(text)
}
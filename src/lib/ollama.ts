let prefetchTime: Date | undefined = undefined
let prefetchSuccess = false;

const timeAmount = 30 * 60 * 1000
function hasPrefetchExpired(): boolean {
    if (prefetchTime == undefined) return true
    const elapsedTime = new Date().getTime() - prefetchTime.getTime()
    return elapsedTime >= timeAmount;
}


export default async function (prompt: string, model: string = 'llama3.2'): Promise<{ success: true, response: string } | { success: false, msg: string }> {
    try {

        if (!prefetchSuccess || hasPrefetchExpired()) {
            console.log(`prefetching at ${process.env.OLLAMA_URL}`)
            const prefetch = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    keep_alive: '10m',
                    stream: false
                })
            })
            prefetchTime = new Date()
            if (prefetch.ok) {
                prefetchSuccess = true;
            } else {
                return { success: false, msg: 'Service is unavailable right now' }
            }
        }

        const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model ?? 'llama3.2',
                prompt: prompt,
                stream: false
            })
        });

        const data: { response?: string } = await res.json();


        if (!data.response) {
            return { success: false, msg: 'No response received from model' };
        }

        return { success: true, response: data.response }
    } catch (error) {
        prefetchSuccess = false;
        prefetchTime = undefined;
        return { success: false, msg: `Somethign went wrong: ${(error as Error).message}` }
    }
}
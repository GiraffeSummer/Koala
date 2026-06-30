let prefetchTime: Date | undefined = undefined
let prefetchSuccess = false;

const timeAmount = 30 * 60 * 1000
function hasPrefetchExpired(): boolean {
    if (prefetchTime == undefined) return true
    const elapsedTime = new Date().getTime() - prefetchTime.getTime()
    return elapsedTime >= timeAmount;
}


export default async function (prompt: string, model: string = 'llama3.2'): Promise<{ success: true, response: string } | { success: false, msg: string }> {
    if (!prefetchSuccess || hasPrefetchExpired()) {
        console.log('prefetching')
        const prefetch = await fetch(`${process.env.OLLAMA_URL}`);//TODO: do a precheck once for online
        prefetchTime = new Date()
        if (prefetch.status == 200) {
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
    return { success: true, response: data.response }
}
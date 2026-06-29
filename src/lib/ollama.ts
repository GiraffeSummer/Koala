export default async function (prompt: string, model: string = 'llama3.2') {

    // const prefetch = await fetch(`${process.env.OLLAMA_URL}`);//TODO: do a precheck once for online

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
    return data.response
}
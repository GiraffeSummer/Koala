import axios from 'axios';
export enum METHODS {
    POST = 'post',
    GET = 'get',
    PUT = 'put'
}

export default async function fetch(uri, opts = { method: METHODS.GET, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }) {
    try {
        const response = await axios({ url: uri, ...opts });
        return response;
    } catch (exception) {
        process.stderr.write(`ERROR received from ${uri}: ${exception}\n`);
    }
}
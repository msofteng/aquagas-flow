import { IFreeImageResponse } from "@src/models/freeimage";

export default class FreeImageService {
    apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey ?? '';
    }

    async sendImage(base64: string): Promise<IFreeImageResponse> {
        const data = new URLSearchParams();

        data.append('source', base64);

        let options: RequestInit = {
            method: 'post',
            body: data
        };
        
        let res = await fetch(`https://freeimage.host/api/1/upload?key=${this.apiKey}`, options);

        return await res.json() as IFreeImageResponse;
    }
}
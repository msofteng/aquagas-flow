import { GoogleGenerativeAI } from "@google/generative-ai";

export default class GoogleGeminiService {
    apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey ?? '';
    }

    async extractText(base64: string, measure_type: "WATER" | "GAS"): Promise<string> {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let image = this.toBase64(base64);

        let prompt = '';

        if (measure_type == 'WATER') {
            prompt = 'hidrômetro';
        } else {
            prompt = 'gás no medidor';
        }

        const result = await model.generateContent([
            `Qual a medição de consumo do ${prompt} desta imagem? (em m³)`,
            {
                inlineData: {
                    data: image.data,
                    mimeType: image.mime
                }
            }
        ]);

        console.log(result.response.text());

        return result.response.text();
    }

    toBase64(base64: string): { mime: string, data: string } {
        const base64UriPattern = /^data:image\/(jpeg|jpg|png|gif);base64,/;
        const base64PurePattern = /^[A-Za-z0-9+/]+[=]{0,2}$/;

        let base64Data = base64;
        let mimeType = '';

        if (base64UriPattern.test(base64)) {
            mimeType = (base64.match(/data:([^;]+);base64,/) ?? '')[1];
            base64Data = base64.split(',')[1];
        } else if (base64PurePattern.test(base64)) {
            mimeType = 'image/jpg';
            base64Data = base64;
        } else {

        }

        return { mime: mimeType, data: base64Data };
    }
}
import '@src/pre-start';

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, ORIGIN, GEMINI_API_KEY, FREEIMAGE_API_KEY } = process.env;
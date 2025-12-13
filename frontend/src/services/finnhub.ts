
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export interface NewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export interface QuoteResponse {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
}

export const fetchGeneralNews = async (): Promise<NewsItem[]> => {
    if (!API_KEY) {
        console.warn('Finnhub API Key is missing');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/news?category=general&token=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`Finnhub API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch general news:', error);
        return [];
    }
};

export const fetchQuote = async (symbol: string): Promise<QuoteResponse | null> => {
    if (!API_KEY) return null;

    try {
        const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`Finnhub quote error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
        return null;
    }
};

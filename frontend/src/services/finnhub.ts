
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

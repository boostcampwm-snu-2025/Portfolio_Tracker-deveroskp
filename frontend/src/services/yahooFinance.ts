const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export interface YahooQuoteResponse {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketPreviousClose: number;
    currency: string;
}

// Map asset names to Yahoo Finance symbols
export const ASSET_SYMBOL_MAP: Record<string, string> = {
    '삼성전자': '005930.KS',
    '카카오': '035720.KS',
    '네이버': '035420.KS',
    '현대차': '005380.KS',
    'SK하이닉스': '000660.KS',
    '애플': 'AAPL',
    '테슬라': 'TSLA',
    '구글': 'GOOGL',
    '마이크로소프트': 'MSFT',
    '비트코인': 'BTC-USD',
    '이더리움': 'ETH-USD',
};

export const fetchYahooQuote = async (symbol: string): Promise<YahooQuoteResponse | null> => {
    try {
        // Use a CORS proxy for client-side requests
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`${YAHOO_FINANCE_BASE_URL}/${symbol}`)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
            console.error(`Yahoo Finance API error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        const result = data.chart?.result?.[0];

        if (!result) {
            return null;
        }

        const meta = result.meta;

        return {
            symbol: meta.symbol,
            regularMarketPrice: meta.regularMarketPrice,
            regularMarketChange: meta.regularMarketPrice - meta.previousClose,
            regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
            regularMarketPreviousClose: meta.previousClose,
            currency: meta.currency,
        };
    } catch (error) {
        console.error(`Failed to fetch Yahoo quote for ${symbol}:`, error);
        return null;
    }
};

// Get Yahoo symbol for an asset name
export const getYahooSymbol = (assetName: string): string | null => {
    // Direct lookup
    if (ASSET_SYMBOL_MAP[assetName]) {
        return ASSET_SYMBOL_MAP[assetName];
    }

    // Try to find partial match
    const cleanName = assetName.replace(/\s*\(.*\)\s*/g, '').trim();
    if (ASSET_SYMBOL_MAP[cleanName]) {
        return ASSET_SYMBOL_MAP[cleanName];
    }

    return null;
};

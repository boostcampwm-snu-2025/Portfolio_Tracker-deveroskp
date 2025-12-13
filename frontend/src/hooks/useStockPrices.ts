import { useQueries } from '@tanstack/react-query';
import { fetchQuote, type QuoteResponse } from '../services/finnhub';

export const useStockPrices = (symbols: string[]) => {
    return useQueries({
        queries: symbols.map((symbol) => ({
            queryKey: ['quote', symbol],
            queryFn: () => fetchQuote(symbol),
            staleTime: 1000 * 60, // 1 minute
            refetchInterval: 1000 * 60, // 1 minute
            enabled: !!symbol,
        })),
    });
};

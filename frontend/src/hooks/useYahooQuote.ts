import { useQuery } from '@tanstack/react-query';
import { fetchYahooQuote, getYahooSymbol, type YahooQuoteResponse } from '../services/yahooFinance';

export const useYahooQuote = (assetName: string) => {
    const symbol = getYahooSymbol(assetName);

    return useQuery({
        queryKey: ['yahooQuote', symbol],
        queryFn: () => symbol ? fetchYahooQuote(symbol) : null,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
        enabled: !!symbol,
    });
};

export const useMultipleYahooQuotes = (assetNames: string[]) => {
    const symbols = assetNames.map(getYahooSymbol).filter(Boolean) as string[];

    return useQuery({
        queryKey: ['yahooQuotes', symbols.join(',')],
        queryFn: async () => {
            const results: Record<string, YahooQuoteResponse | null> = {};

            await Promise.all(
                symbols.map(async (symbol) => {
                    const quote = await fetchYahooQuote(symbol);
                    results[symbol] = quote;
                })
            );

            return results;
        },
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 5,
        enabled: symbols.length > 0,
    });
};

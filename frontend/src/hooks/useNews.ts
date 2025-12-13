import { useQuery } from '@tanstack/react-query';
import { fetchGeneralNews, type NewsItem } from '../services/finnhub';

export const useMarketNews = () => {
    return useQuery<NewsItem[]>({
        queryKey: ['marketNews'],
        queryFn: fetchGeneralNews,
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
        refetchOnWindowFocus: false,
    });
};

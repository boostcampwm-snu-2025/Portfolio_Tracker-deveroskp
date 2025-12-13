import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const usePortfolioSummary = () => {
    return useQuery({
        queryKey: ['portfolioSummary'],
        queryFn: () => api.getPortfolioSummary(),
    });
};

export const useAssetAllocation = () => {
    return useQuery({
        queryKey: ['assetAllocation'],
        queryFn: () => api.getAssetAllocation(),
    });
};

export const usePerformanceSummary = () => {
    return useQuery({
        queryKey: ['performanceSummary'],
        queryFn: () => api.getPerformanceSummary(),
    });
};

export const useReturnTrend = () => {
    return useQuery({
        queryKey: ['returnTrend'],
        queryFn: () => api.getReturnTrend(),
    });
};

export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: () => api.getTransactions(),
    });
};

export const useRebalancingSuggestions = () => {
    return useQuery({
        queryKey: ['rebalancingSuggestions'],
        queryFn: () => api.getRebalancingSuggestions(),
    });
};

export const useTargetAllocation = () => {
    return useQuery({
        queryKey: ['targetAllocation'],
        queryFn: () => api.getTargetAllocation(),
    });
};

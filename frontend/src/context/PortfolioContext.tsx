import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    usePortfolioSummary,
    useAssetAllocation,
    usePerformanceSummary,
    useReturnTrend,
    useTransactions,
    useRebalancingSuggestions,
    useTargetAllocation
} from '../hooks/usePortfolioQueries';
import type { PortfolioSummary, AssetAllocation, PerformanceItem, ReturnTrendItem, TransactionType, RebalancingSuggestion, TargetAllocation } from '../types';

interface PortfolioContextType {
    portfolioSummary: PortfolioSummary | null;
    assetAllocation: AssetAllocation[];
    performanceSummary: PerformanceItem[];
    returnTrendData: ReturnTrendItem[];
    transactions: TransactionType[];
    rebalancingSuggestions: RebalancingSuggestion[];
    targetAllocation: TargetAllocation[];
    loading: boolean;
    addTransaction: (transaction: TransactionType) => void;
    updateTargetAllocation: (asset: string, newValue: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();

    const { data: portfolioSummary, isLoading: loadingSummary } = usePortfolioSummary();
    const { data: assetAllocation, isLoading: loadingAllocation } = useAssetAllocation();
    const { data: performanceSummary, isLoading: loadingPerformance } = usePerformanceSummary();
    const { data: returnTrendData, isLoading: loadingTrend } = useReturnTrend();
    const { data: transactions, isLoading: loadingTransactions } = useTransactions();
    const { data: rebalancingSuggestions, isLoading: loadingSuggestions } = useRebalancingSuggestions();
    const { data: targetAllocation, isLoading: loadingTargets } = useTargetAllocation();

    const loading = loadingSummary || loadingAllocation || loadingPerformance || loadingTrend || loadingTransactions || loadingSuggestions || loadingTargets;

    const addTransaction = (transaction: TransactionType) => {
        queryClient.setQueryData(['transactions'], (old: TransactionType[] | undefined) => {
            return old ? [transaction, ...old] : [transaction];
        });
    };

    const updateTargetAllocation = (asset: string, newValue: number) => {
        queryClient.setQueryData(['targetAllocation'], (old: TargetAllocation[] | undefined) => {
            return old ? old.map(t => t.asset === asset ? { ...t, target: newValue } : t) : [];
        });
    };

    return (
        <PortfolioContext.Provider value={{
            portfolioSummary: portfolioSummary || null,
            assetAllocation: assetAllocation || [],
            performanceSummary: performanceSummary || [],
            returnTrendData: returnTrendData || [],
            transactions: transactions || [],
            rebalancingSuggestions: rebalancingSuggestions || [],
            targetAllocation: targetAllocation || [],
            loading,
            addTransaction,
            updateTargetAllocation
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};

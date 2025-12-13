import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    usePortfolioSummary,
    useAssetAllocation,
    usePerformanceSummary,
    useReturnTrend,
    useTransactions,
    useRebalancingSuggestions
} from '../hooks/usePortfolioQueries';
import type { PortfolioSummary, AssetAllocation, PerformanceItem, ReturnTrendItem, TransactionType, RebalancingSuggestion, TargetAllocation, Asset } from '../types';

interface PortfolioContextType {
    portfolioSummary: PortfolioSummary | null;
    assetAllocation: AssetAllocation[];
    performanceSummary: PerformanceItem[];
    returnTrendData: ReturnTrendItem[];
    transactions: TransactionType[];
    assets: Asset[];
    rebalancingSuggestions: RebalancingSuggestion[];
    targetAllocation: TargetAllocation[];
    loading: boolean;
    addTransaction: (transaction: TransactionType) => void;
    updateTargetAllocation: (asset: string, newValue: number) => void;
    resetTargetAllocation: () => void;
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

    const loading = loadingSummary || loadingAllocation || loadingPerformance || loadingTrend || loadingTransactions || loadingSuggestions;

    // Use state for targetAllocation so it can be updated independently
    const [targetAllocation, setTargetAllocation] = useState<TargetAllocation[]>([]);

    // Initialize/update targetAllocation when assetAllocation changes
    useEffect(() => {
        if (!assetAllocation || assetAllocation.length === 0) return;

        setTargetAllocation(prev => {
            // Create a map of existing targets
            const existingTargets = new Map(prev.map(t => [t.asset, t.target]));

            return assetAllocation.map(asset => {
                const currentPercent = Math.round(asset.value * 100) / 100;
                // Keep existing target if available, otherwise use current
                const existingTarget = existingTargets.get(asset.name);
                return {
                    asset: asset.name,
                    current: currentPercent,
                    target: existingTarget !== undefined ? existingTarget : currentPercent
                };
            });
        });
    }, [assetAllocation]);

    // Calculate assets from transactions
    const assets = useMemo(() => {
        if (!transactions) return [];

        const assetMap = new Map<string, { amount: number; totalCost: number }>();

        transactions.forEach(tx => {
            if (!assetMap.has(tx.asset)) {
                assetMap.set(tx.asset, { amount: 0, totalCost: 0 });
            }
            const current = assetMap.get(tx.asset)!;
            if (tx.type === '매수') {
                current.amount += tx.amount;
                current.totalCost += tx.total + tx.fee;
            } else if (tx.type === '매도') {
                const avgPrice = current.amount > 0 ? current.totalCost / current.amount : 0;
                current.amount -= tx.amount;
                current.totalCost -= avgPrice * tx.amount;
            }
        });

        return Array.from(assetMap.entries())
            .filter(([_, data]) => data.amount > 0)
            .map(([name, data]) => ({
                name,
                amount: data.amount,
                avgPrice: data.amount > 0 ? data.totalCost / data.amount : 0,
                value: 0
            }));
    }, [transactions]);

    const addTransaction = async (transaction: TransactionType): Promise<boolean> => {
        try {
            await api.createTransaction(transaction);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['portfolioSummary'] });
            queryClient.invalidateQueries({ queryKey: ['assetAllocation'] });
            return true;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('거래 생성에 실패했습니다.');
            }
            console.error('Failed to create transaction:', error);
            return false;
        }
    };

    const updateTargetAllocation = (asset: string, newValue: number) => {
        setTargetAllocation(prev =>
            prev.map(t => t.asset === asset ? { ...t, target: newValue } : t)
        );
    };

    const resetTargetAllocation = () => {
        setTargetAllocation(prev =>
            prev.map(t => ({ ...t, target: t.current }))
        );
    };

    return (
        <PortfolioContext.Provider value={{
            portfolioSummary: portfolioSummary || null,
            assetAllocation: assetAllocation || [],
            performanceSummary: performanceSummary || [],
            returnTrendData: returnTrendData || [],
            transactions: transactions || [],
            assets,
            rebalancingSuggestions: rebalancingSuggestions || [],
            targetAllocation,
            loading,
            addTransaction,
            updateTargetAllocation,
            resetTargetAllocation
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

import type { AppData, PortfolioSummary, AssetAllocation, PerformanceItem, ReturnTrendItem, TransactionType, RebalancingSuggestion, TargetAllocation } from '../types';

const MOCK_DATA_URL = '/mockdata.json';

export const api = {
    async fetchData(): Promise<AppData> {
        const response = await fetch(MOCK_DATA_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.json();
    },

    async getPortfolioSummary(): Promise<PortfolioSummary> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/portfolio/summary`);
        if (!response.ok) throw new Error('Failed to fetch portfolio summary');
        return response.json();
    },

    async getAssetAllocation(): Promise<AssetAllocation[]> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/portfolio/allocation`);
        if (!response.ok) throw new Error('Failed to fetch asset allocation');
        return response.json();
    },

    async getPerformanceSummary(): Promise<PerformanceItem[]> {
        const data = await this.fetchData();
        return data.performanceSummary;
    },

    async getReturnTrend(): Promise<ReturnTrendItem[]> {
        const data = await this.fetchData();
        return data.returnTrendData;
    },

    async getTransactions(): Promise<TransactionType[]> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/transactions/`);
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        // Map backend Date string to string (or Date object if needed, but type says string usually? Check types.ts if convenient, assuming string is fine for now or auto-conversion)
        return data;
    },

    async getRebalancingSuggestions(): Promise<RebalancingSuggestion[]> {
        const data = await this.fetchData();
        return data.rebalancingSuggestions;
    },

    async getTargetAllocation(): Promise<TargetAllocation[]> {
        const data = await this.fetchData();
        return data.targetAllocation;
    },

    async createTransaction(transaction: Omit<TransactionType, 'id' | 'status' | 'total'>): Promise<TransactionType> {
        const payload = {
            type: transaction.type,
            asset: transaction.asset,
            ticker: null,
            amount: transaction.amount,
            price: transaction.price,
            currency: 'KRW',
            fee: transaction.fee || 0
        };
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/transactions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create transaction');
        }
        return response.json();
    }
};

import type { AppData, PortfolioSummary, AssetAllocation, PerformanceItem, ReturnTrendItem, Transaction, RebalancingSuggestion, TargetAllocation } from '../types';

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
        const data = await this.fetchData();
        return data.portfolioSummary;
    },

    async getAssetAllocation(): Promise<AssetAllocation[]> {
        const data = await this.fetchData();
        return data.assetAllocation;
    },

    async getPerformanceSummary(): Promise<PerformanceItem[]> {
        const data = await this.fetchData();
        return data.performanceSummary;
    },

    async getReturnTrend(): Promise<ReturnTrendItem[]> {
        const data = await this.fetchData();
        return data.returnTrendData;
    },

    async getTransactions(): Promise<Transaction[]> {
        const data = await this.fetchData();
        return data.transactions;
    },

    async getRebalancingSuggestions(): Promise<RebalancingSuggestion[]> {
        const data = await this.fetchData();
        return data.rebalancingSuggestions;
    },

    async getTargetAllocation(): Promise<TargetAllocation[]> {
        const data = await this.fetchData();
        return data.targetAllocation;
    }
};

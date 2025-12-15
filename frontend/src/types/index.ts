export interface PortfolioSummary {
    totalValue: number;
    todaysChange: number;
    todaysChangePercent: number;
    realizedPnL: number;
    unrealizedPnL: number;
}

export interface AssetAllocation {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export interface PerformanceItem {
    period: string;
    value: number;
    isPositive: boolean;
}

export interface ReturnTrendItem {
    month: string;
    value: number;
}

export interface TransactionType {
    id: string;
    date: string;
    asset: string;
    ticker?: string;
    type: string;
    amount: number;
    price: number;
    total: number;
    fee: number;
    status: string;
}

export interface Asset {
    name: string;
    ticker?: string;
    amount: number;
    avgPrice: number;
    value: number;
    currentPrice?: number;
}

export interface RebalancingSuggestion {
    asset: string;
    action?: string;
    detail?: string;
    type?: string;
    amount?: number;
    reason?: string;
    urgency?: string;
}

export interface TargetAllocation {
    asset: string;
    current: number;
    target: number;
}

export interface AppData {
    portfolioSummary: PortfolioSummary;
    assetAllocation: AssetAllocation[];
    performanceSummary: PerformanceItem[];
    returnTrendData: ReturnTrendItem[];
    transactions: TransactionType[];
    rebalancingSuggestions: RebalancingSuggestion[];
    targetAllocation: TargetAllocation[];
}
export interface Asset {
    name: string;
    amount: number;
    avgPrice: number;
    value: number;
}

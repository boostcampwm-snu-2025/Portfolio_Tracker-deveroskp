import { useState, useEffect, useMemo } from 'react';
import { Sliders, RefreshCw, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { useMultipleYahooQuotes } from '../hooks/useYahooQuote';
import { getYahooSymbol } from '../services/yahooFinance';

interface EnhancedSuggestion {
    asset: string;
    symbol: string;
    type: '매수' | '매도';
    currentPercent: number;
    targetPercent: number;
    diffPercent: number;
    currentPrice: number;
    requiredAmount: number; // KRW amount to buy/sell
    requiredQuantity: number; // Number of shares/units
    detail: string;
}

const Rebalancing = () => {
    const { targetAllocation, portfolioSummary, updateTargetAllocation, resetTargetAllocation, loading } = usePortfolio();

    // Get asset names for Yahoo Finance lookup
    const assetNames = targetAllocation.map(item => item.asset);
    const { data: quotes, isLoading: quotesLoading } = useMultipleYahooQuotes(assetNames);

    // Calculate enhanced suggestions with exact amounts
    const suggestions = useMemo<EnhancedSuggestion[]>(() => {
        if (targetAllocation.length === 0 || !portfolioSummary) return [];

        const totalValue = portfolioSummary.totalValue || 0;
        const totalTarget = targetAllocation.reduce((acc, cur) => acc + cur.target, 0);

        // Avoid division by zero
        if (totalTarget === 0) return [];

        return targetAllocation
            .map(item => {
                // Normalize target if total is not 100
                const normalizedTarget = (item.target / totalTarget) * 100;
                const diff = normalizedTarget - item.current;
                
                // Only show suggestions if diff is significant (e.g. >= 1%)
                if (Math.abs(diff) < 1) return null;

                const symbol = getYahooSymbol(item.asset);
                const quote = symbol && quotes ? quotes[symbol] : null;
                const currentPrice = quote?.regularMarketPrice || 0;

                // Calculate required amount in KRW
                const requiredAmount = Math.abs(diff / 100) * totalValue;

                // Calculate required quantity
                const requiredQuantity = currentPrice > 0 ? requiredAmount / currentPrice : 0;

                return {
                    asset: item.asset,
                    symbol: symbol || '-',
                    type: diff > 0 ? '매수' : '매도',
                    currentPercent: item.current,
                    targetPercent: Number(normalizedTarget.toFixed(1)), // Use normalized target for display
                    diffPercent: diff,
                    currentPrice,
                    requiredAmount,
                    requiredQuantity,
                    detail: diff > 0
                        ? `${formatPercent(item.current)}% → ${formatPercent(normalizedTarget)}%`
                        : `${formatPercent(item.current)}% → ${formatPercent(normalizedTarget)}%`
                };
            })
            .filter((item): item is EnhancedSuggestion => item !== null);
    }, [targetAllocation, portfolioSummary, quotes]);

    const handleSliderChange = (asset: string, newValue: number) => {
        updateTargetAllocation(asset, newValue);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const totalTarget = targetAllocation.reduce((acc, cur) => acc + cur.target, 0);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">리밸런싱 페이지</h1>
                <p className="text-slate-500">목표 자산 비중을 설정하고 정확한 매수/매도 금액을 확인하세요.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Target Allocation Sliders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-primary" />
                            목표 비중 설정
                        </h2>
                        <button
                            onClick={resetTargetAllocation}
                            className="text-sm text-primary hover:underline"
                        >
                            초기화
                        </button>
                    </div>

                    <div className="space-y-6">
                        {targetAllocation.map((item) => {
                            const diff = item.target - item.current;
                            return (
                                <div key={item.asset}>
                                    <div className="flex justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900">{item.asset}</span>
                                            {diff !== 0 && (
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${diff > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {diff > 0 ? '+' : ''}{formatPercent(diff)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-slate-900">{item.target}%</span>
                                            <span className="text-xs text-slate-400 ml-1">(현재 {formatPercent(item.current)}%)</span>
                                        </div>
                                    </div>
                                    {/* Progress bar showing current vs target */}
                                    <div className="relative h-2 bg-slate-100 rounded-full mb-1">
                                        <div
                                            className="absolute h-full bg-slate-300 rounded-full"
                                            style={{ width: `${Math.min(item.current, 100)}%` }}
                                        />
                                        <div
                                            className="absolute h-full bg-primary rounded-full opacity-50"
                                            style={{ width: `${Math.min(item.target, 100)}%` }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={item.target}
                                        onChange={(e) => handleSliderChange(item.asset, Number(e.target.value))}
                                        className="w-full h-2 bg-transparent appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            );
                        })}

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-sm text-slate-500">총 합계</span>
                            <span className={`font-bold ${totalTarget === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {totalTarget}%
                                {totalTarget !== 100 && <span className="text-xs font-normal ml-1">({totalTarget > 100 ? '+' : ''}{totalTarget - 100}%)</span>}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Enhanced Suggestions with Exact Amounts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-primary" />
                            매수/매도 제안
                        </h2>
                        {quotesLoading && <span className="text-xs text-slate-400">시세 로딩중...</span>}
                    </div>

                    <div className="space-y-4">
                        {totalTarget !== 100 && totalTarget > 0 && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                                        <RefreshCw className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-blue-900">자동 비율 조정됨</h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            목표 비중의 합계({totalTarget}%)가 100%가 아니어서, 
                                            각 자산의 비중을 100% 기준으로 자동 환산하여 계산했습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {suggestions.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                                <p>현재 포트폴리오가 목표 비중과 일치합니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {suggestions.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl border-l-4 ${item.type === '매수'
                                                ? 'border-l-emerald-500 bg-emerald-50/30'
                                                : 'border-l-rose-500 bg-rose-50/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-slate-900">{item.asset}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === '매수'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-rose-100 text-rose-700'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400">{item.symbol}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <span>{item.currentPercent.toFixed(1)}%</span>
                                                    <span>→</span>
                                                    <span className="font-medium text-slate-700">{item.targetPercent}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="bg-white/50 rounded-lg p-2">
                                                <p className="text-xs text-slate-500 mb-1">현재가</p>
                                                <p className="font-semibold text-slate-900">
                                                    {item.currentPrice > 0 ? formatCurrency(item.currentPrice) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-white/50 rounded-lg p-2">
                                                <p className="text-xs text-slate-500 mb-1">{item.type} 금액</p>
                                                <p className={`font-bold ${item.type === '매수' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(item.requiredAmount)}
                                                </p>
                                            </div>
                                            <div className="bg-white/50 rounded-lg p-2">
                                                <p className="text-xs text-slate-500 mb-1">{item.type} 수량</p>
                                                <p className={`font-bold ${item.type === '매수' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {item.requiredQuantity > 0 ? formatNumber(item.requiredQuantity) : '-'}
                                                    <span className="text-xs font-normal text-slate-400 ml-1">주</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Summary */}
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">총 리밸런싱 예상 거래</span>
                                        <span className="font-bold text-slate-900">
                                            {formatCurrency(suggestions.reduce((acc, item) => acc + item.requiredAmount, 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rebalancing;

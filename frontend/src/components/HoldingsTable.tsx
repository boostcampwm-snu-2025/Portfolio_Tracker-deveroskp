
import { usePortfolio } from '../context/PortfolioContext';
import { useMultipleYahooQuotes } from '../hooks/useYahooQuote';
import { getYahooSymbol, ASSET_SYMBOL_MAP } from '../services/yahooFinance';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const HoldingsTable = () => {
    const { assets } = usePortfolio();

    // Get asset names for Yahoo Finance lookup
    const assetNames = assets.map(asset => asset.name);
    const { data: quotes, isLoading: quotesLoading } = useMultipleYahooQuotes(assetNames);

    // Merge portfolio data with live price data
    const holdings = useMemo(() => {
        return assets.map((asset) => {
            const symbol = getYahooSymbol(asset.name);
            const quote = symbol && quotes ? quotes[symbol] : null;

            // use live price if available, otherwise fallback to avgPrice
            const currentPrice = quote?.regularMarketPrice || asset.avgPrice || 0;
            const currentValue = currentPrice * asset.amount;
            const totalCost = asset.avgPrice * asset.amount;
            const profit = currentValue - totalCost;
            const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;

            return {
                ...asset,
                symbol: symbol || '-',
                currentPrice,
                currentValue,
                profit,
                profitPercent,
                isLoading: quotesLoading,
                dayChange: quote?.regularMarketChangePercent || 0
            };
        });
    }, [assets, quotes, quotesLoading]);

    if (holdings.length === 0) {
        return (
            <div className="h-full flex flex-col">
                <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                    <h2 className="text-lg font-semibold text-slate-900">실시간 보유 종목 현황</h2>
                </div>
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    보유 종목이 없습니다
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                <h2 className="text-lg font-semibold text-slate-900">실시간 보유 종목 현황</h2>
                {quotesLoading && <span className="text-xs text-slate-400 ml-2">시세 로딩중...</span>}
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-3 py-2">자산</th>
                            <th className="px-3 py-2 text-right">수량</th>
                            <th className="px-3 py-2 text-right">평단가</th>
                            <th className="px-3 py-2 text-right">현재가</th>
                            <th className="px-3 py-2 text-right">평가금액</th>
                            <th className="px-3 py-2 text-right">수익률</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {holdings.map((item) => (
                            <tr key={item.name} className="hover:bg-slate-50/50">
                                <td className="px-3 py-2 font-medium text-slate-900">
                                    {item.name}
                                    <span className="block text-xs text-slate-400 font-normal">{item.symbol}</span>
                                </td>
                                <td className="px-3 py-2 text-right text-slate-600">{item.amount}</td>
                                <td className="px-3 py-2 text-right text-slate-600">{formatCurrency(item.avgPrice)}</td>
                                <td className="px-3 py-2 text-right text-slate-900 font-medium">
                                    {item.isLoading ? (
                                        <span className="animate-pulse bg-slate-200 h-4 w-12 inline-block rounded"></span>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <span>{formatCurrency(item.currentPrice)}</span>
                                            <span className={`text-[10px] flex items-center ${item.dayChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {item.dayChange > 0 ? '+' : ''}{formatPercent(item.dayChange)}% (1D)
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-3 py-2 text-right text-slate-900 font-medium">
                                    {formatCurrency(item.currentValue)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    <div className={`flex items-center justify-end gap-1 ${item.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {item.profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        <span className="font-medium">{formatPercent(item.profitPercent)}%</span>
                                    </div>
                                    <span className={`text-xs block ${item.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {item.profit > 0 ? '+' : ''}{formatCurrency(item.profit)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HoldingsTable;

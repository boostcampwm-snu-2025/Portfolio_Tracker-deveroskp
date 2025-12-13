
import { usePortfolio } from '../context/PortfolioContext';
import { useStockPrices } from '../hooks/useStockPrices';
import { formatCurrency } from '../utils/formatters';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mapping for demo purposes since Finnhub requires specific symbols
const SYMBOL_MAP: Record<string, string> = {
    '삼성전자 (KRW)': '005930.KO',
    '삼성전자': '005930.KO',
    '애플 (USD)': 'AAPL',
    '애플': 'AAPL',
    '비트코인 (BTC)': 'BINANCE:BTCUSDT',
    '비트코인': 'BINANCE:BTCUSDT',
    '이더리움 (ETH)': 'BINANCE:ETHUSDT',
    '이더리움': 'BINANCE:ETHUSDT',
    '테슬라 (USD)': 'TSLA',
    '테슬라': 'TSLA',
};

const HoldingsTable = () => {
    const { assets } = usePortfolio();

    // extract symbols
    const symbols = assets.map(asset => SYMBOL_MAP[asset.name] || '').filter(Boolean);
    const queries = useStockPrices(symbols);

    // Merge portfolio data with live price data
    const holdings = useMemo(() => {
        return assets.map((asset) => {
            const symbol = SYMBOL_MAP[asset.name];
            const queryIndex = symbols.indexOf(symbol);
            const quote = queryIndex >= 0 ? queries[queryIndex].data : null;
            const isLoading = queryIndex >= 0 ? queries[queryIndex].isLoading : false;

            // use live price if available, otherwise fallback to asset.avgPrice (or could use a mock current price in context)
            const currentPrice = quote?.c || asset.value / asset.amount; // fallback calculation
            const currentValue = currentPrice * asset.amount;
            const totalCost = asset.avgPrice * asset.amount;
            const profit = currentValue - totalCost;
            const profitPercent = (profit / totalCost) * 100;

            return {
                ...asset,
                symbol,
                currentPrice,
                currentValue,
                profit,
                profitPercent,
                isLoading,
                dayChange: quote?.dp || 0
            };
        });
    }, [assets, queries, symbols]);

    return (
        <div className="h-full flex flex-col">
            <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                <h2 className="text-lg font-semibold text-slate-900">실시간 보유 종목 현황</h2>
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
                                                {item.dayChange > 0 ? '+' : ''}{item.dayChange.toFixed(2)}% (1D)
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
                                        <span className="font-medium">{item.profitPercent.toFixed(2)}%</span>
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

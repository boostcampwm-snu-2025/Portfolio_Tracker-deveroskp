import { useState, useEffect } from 'react';
import { Sliders, RefreshCw, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency } from '../utils/formatters';
import type { RebalancingSuggestion } from '../types';

const Rebalancing = () => {
    const { targetAllocation, updateTargetAllocation, resetTargetAllocation, loading } = usePortfolio();
    const [suggestions, setSuggestions] = useState<RebalancingSuggestion[]>([]);

    // Calculate suggestions based on target vs current allocation
    useEffect(() => {
        if (targetAllocation.length === 0) {
            setSuggestions([]);
            return;
        }

        const newSuggestions: RebalancingSuggestion[] = [];

        targetAllocation.forEach((item) => {
            const diff = item.target - item.current;
            const amount = Math.abs(diff) * 100000;

            if (Math.abs(diff) >= 1) {
                newSuggestions.push({
                    asset: item.asset,
                    type: diff > 0 ? '매수' : '매도',
                    amount: amount,
                    detail: diff > 0 ? '포트폴리오 비중 증가' : '비중 축소',
                });
            }
        });

        setSuggestions(newSuggestions);
    }, [targetAllocation]);

    const handleSliderChange = (asset: string, newValue: number) => {
        updateTargetAllocation(asset, newValue);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">리밸런싱 페이지</h1>
                <p className="text-slate-500">목표 자산 비중을 설정하고, 현재 포트폴리오와의 차이를 시각화하며, 매수/매도 제안을 확인하세요.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                    <div className="space-y-8">
                        {targetAllocation.map((item) => (
                            <div key={item.asset}>
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <span className="font-medium text-slate-900">{item.asset}</span>
                                        <span className="text-xs text-slate-500 ml-2">현재 {item.current}%</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{item.target}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={item.target}
                                    onChange={(e) => handleSliderChange(item.asset, Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        ))}

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-sm text-slate-500">총 합계</span>
                            <span className={`font-bold ${targetAllocation.reduce((acc, cur) => acc + cur.target, 0) === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {targetAllocation.reduce((acc, cur) => acc + cur.target, 0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Suggestions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-primary" />
                        매수/매도 제안 목록
                    </h2>

                    <div className="space-y-4">
                        {suggestions.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                                <p>현재 포트폴리오가 목표 비중과 일치합니다.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="px-4 py-3">자산</th>
                                            <th className="px-4 py-3 text-center">유형</th>
                                            <th className="px-4 py-3 text-right">금액</th>
                                            <th className="px-4 py-3">영향</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {suggestions.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{item.asset}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${item.type === '매수' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-900">
                                                    {formatCurrency(item.amount || 0)}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 text-xs">
                                                    {item.detail || item.reason}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rebalancing;

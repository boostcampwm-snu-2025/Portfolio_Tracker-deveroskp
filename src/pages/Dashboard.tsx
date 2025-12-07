import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Bell, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
    const {
        portfolioSummary,
        assetAllocation,
        performanceSummary,
        returnTrendData,
        rebalancingSuggestions,
        loading
    } = usePortfolio();

    if (loading || !portfolioSummary) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
                    <p className="text-slate-500">포트폴리오 현황을 한눈에 확인하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                </div>
            </header>

            {/* Top Section: Asset Summary & Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Asset Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">총 자산 현황</h2>
                    <p className="text-sm text-slate-500 mb-6">전체 포트폴리오의 현재 가치</p>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-4xl font-bold text-slate-900">{formatCurrency(portfolioSummary.totalValue)}</span>
                        <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {formatCurrency(portfolioSummary.todaysChange)} ({portfolioSummary.todaysChangePercent}%)
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">실현 손익</p>
                            <p className="text-xl font-semibold text-slate-900">{formatCurrency(portfolioSummary.realizedPnL)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">미실현 손익</p>
                            <p className="text-xl font-semibold text-slate-900">{formatCurrency(portfolioSummary.unrealizedPnL)}</p>
                        </div>
                    </div>
                </div>

                {/* Asset Allocation Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">자산별 비중</h2>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetAllocation}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {assetAllocation.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-sm text-slate-400">Total 100%</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {assetAllocation.map((item) => (
                            <div key={item.name} className="flex items-center text-xs text-slate-600">
                                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Section: Performance, Rebalancing, Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Performance Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">최근 성과 요약</h2>
                    <div className="space-y-4">
                        {performanceSummary.map((item) => (
                            <div key={item.period} className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">{item.period}</span>
                                <span className={`text-sm font-medium px-2 py-1 rounded-lg ${item.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {item.isPositive ? '+' : ''}{item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rebalancing Recommendations */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">리밸런싱 권고</h2>
                    <div className="space-y-4 mb-6">
                        {rebalancingSuggestions.map((item, idx) => (
                            <div key={idx} className="border-l-2 border-slate-200 pl-3">
                                <p className="text-sm font-medium text-slate-900">{item.asset}</p>
                                <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        리밸런싱 페이지로 이동
                    </button>
                </div>

                {/* Notifications (Mock) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">주요 알림</h2>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="mt-1"><Bell className="w-4 h-4 text-primary" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">시가총액 상위 종목 변동 알림</p>
                                <p className="text-xs text-slate-400 mt-0.5">1시간 전</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><AlertCircle className="w-4 h-4 text-amber-500" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">A기업 주식 52주 신저가 기록</p>
                                <p className="text-xs text-slate-400 mt-0.5">3시간 전</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-1"><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">새로운 투자 기회 탐색: 친환경 에너지</p>
                                <p className="text-xs text-slate-400 mt-0.5">1일 전</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Return Trend Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">포트폴리오 수익률 추이</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={returnTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#2563eb' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

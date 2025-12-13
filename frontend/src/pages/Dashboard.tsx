import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, RotateCcw } from 'lucide-react';
import Notification from '../components/Notification';
import HoldingsTable from '../components/HoldingsTable';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency } from '../utils/formatters';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const initialLayouts = {
    lg: [
        { i: 'totalAssets', x: 0, y: 0, w: 8, h: 9 },
        { i: 'allocation', x: 8, y: 0, w: 4, h: 9 },
        { i: 'performance', x: 0, y: 9, w: 4, h: 8 },
        { i: 'rebalancing', x: 4, y: 9, w: 4, h: 8 },
        { i: 'notifications', x: 8, y: 9, w: 4, h: 8 },
        { i: 'holdings', x: 0, y: 17, w: 12, h: 14 },
        { i: 'trend', x: 0, y: 31, w: 12, h: 12 }
    ],
    md: [
        { i: 'totalAssets', x: 0, y: 0, w: 6, h: 9 },
        { i: 'allocation', x: 6, y: 0, w: 4, h: 9 },
        { i: 'performance', x: 0, y: 9, w: 5, h: 8 },
        { i: 'rebalancing', x: 5, y: 9, w: 5, h: 8 },
        { i: 'notifications', x: 0, y: 17, w: 10, h: 6 },
        { i: 'holdings', x: 0, y: 23, w: 10, h: 10 },
        { i: 'trend', x: 0, y: 33, w: 10, h: 10 }
    ],
    sm: [
        { i: 'totalAssets', x: 0, y: 0, w: 6, h: 10 },
        { i: 'allocation', x: 0, y: 10, w: 6, h: 10 },
        { i: 'performance', x: 0, y: 20, w: 6, h: 8 },
        { i: 'rebalancing', x: 0, y: 28, w: 6, h: 8 },
        { i: 'notifications', x: 0, y: 36, w: 6, h: 6 },
        { i: 'holdings', x: 0, y: 42, w: 6, h: 10 },
        { i: 'trend', x: 0, y: 52, w: 6, h: 10 }
    ]
};

const Dashboard = () => {
    const navigate = useNavigate();
    const {
        portfolioSummary,
        assetAllocation,
        performanceSummary,
        returnTrendData,
        rebalancingSuggestions,
        loading
    } = usePortfolio();

    // State for layout
    const [layouts, setLayouts] = useState(() => {
        const savedLayouts = localStorage.getItem('dashboard_layouts');
        return savedLayouts ? JSON.parse(savedLayouts) : initialLayouts;
    });

    // Save layout changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onLayoutChange = (_currentLayout: any, allLayouts: any) => {
        setLayouts(allLayouts);
        localStorage.setItem('dashboard_layouts', JSON.stringify(allLayouts));
    };

    const resetLayout = () => {
        setLayouts(initialLayouts);
        localStorage.removeItem('dashboard_layouts');
    };

    if (loading || !portfolioSummary) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const cardClass = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full overflow-hidden flex flex-col";

    return (
        <div className="pb-10">
            <header className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
                    <p className="text-slate-500">포트폴리오 현황을 한눈에 확인하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetLayout}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        레이아웃 초기화
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                </div>
            </header>

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={30}
                onLayoutChange={onLayoutChange}
                isDraggable={true}
                isResizable={false}
                draggableHandle=".drag-handle"
            >
                {/* Total Asset Card */}
                <div key="totalAssets" className={cardClass}>
                    <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                        <h2 className="text-lg font-semibold text-slate-900">총 자산 현황</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">전체 포트폴리오의 현재 가치</p>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-4xl font-bold text-slate-900">{formatCurrency(portfolioSummary.totalValue)}</span>
                        <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {formatCurrency(portfolioSummary.todaysChange)} ({portfolioSummary.todaysChangePercent}%)
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-auto">
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
                <div key="allocation" className={cardClass}>
                    <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                        <h2 className="text-lg font-semibold text-slate-900">자산별 비중</h2>
                    </div>
                    <div className="flex-1 min-h-0 relative">
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
                                        <Cell key={`cell - ${index} `} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value}% `} />
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

                {/* Performance Summary */}
                <div key="performance" className={cardClass}>
                    <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                        <h2 className="text-lg font-semibold text-slate-900">최근 성과 요약</h2>
                    </div>
                    <div className="space-y-4 flex-1">
                        {performanceSummary.map((item) => (
                            <div key={item.period} className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">{item.period}</span>
                                <span className={`text - sm font - medium px - 2 py - 1 rounded - lg ${item.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} `}>
                                    {item.isPositive ? '+' : ''}{item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rebalancing Recommendations */}
                <div key="rebalancing" className={cardClass}>
                    <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                        <h2 className="text-lg font-semibold text-slate-900">리밸런싱 권고</h2>
                    </div>
                    <div className="space-y-4 mb-6 flex-1 overflow-auto">
                        {rebalancingSuggestions.map((item, idx) => (
                            <div key={idx} className="border-l-2 border-slate-200 pl-3">
                                <p className="text-sm font-medium text-slate-900">{item.asset}</p>
                                <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors mt-auto" onClick={() => navigate('/rebalancing')}>
                        리밸런싱 페이지로 이동
                    </button>
                </div>

                {/* Notifications (Now Market News) */}
                <div key="notifications" className={cardClass}>
                    <Notification />
                </div>

                {/* Live Holdings Table */}
                <div key="holdings" className={cardClass}>
                    <HoldingsTable />
                </div>

                {/* Bottom Section: Return Trend Chart */}
                <div key="trend" className={cardClass}>
                    <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                        <h2 className="text-lg font-semibold text-slate-900">포트폴리오 수익률 추이</h2>
                    </div>
                    <div className="flex-1 min-h-0">
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
            </ResponsiveGridLayout>
        </div>
    );
};

export default Dashboard;

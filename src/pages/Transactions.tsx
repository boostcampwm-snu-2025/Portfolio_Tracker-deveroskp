import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatNumber, formatCurrency } from '../utils/formatters';
import Transaction from '../components/Transaction';
import type { TransactionType } from '../types';

const Transactions = () => {
    const { transactions, addTransaction, loading, portfolioSummary } = usePortfolio();
    const [formData, setFormData] = useState({
        type: '매수',
        asset: '삼성전자 (KRW)',
        amount: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        fee: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const safeParse = (val: string) => parseFloat(val.replace(/,/g, '')) || 0;
    const expectedChange = safeParse(formData.amount) * safeParse(formData.price) + safeParse(formData.fee);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTx: TransactionType = {
            id: `tx${Date.now()}`,
            ...formData,
            amount: Number(formData.amount),
            price: Number(formData.price),
            total: Number(formData.amount) * Number(formData.price),
            fee: Number(formData.fee),
            status: '완료',
        };
        addTransaction(newTx);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">트랜잭션 입력</h1>
                <p className="text-slate-500">새로운 거래를 기록하고 내역을 관리하세요.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add Transaction Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">새 거래 기록 추가</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">거래 유형</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="매수"
                                            checked={formData.type === '매수'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                        />
                                        <span className="text-sm text-slate-700">매수</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="매도"
                                            checked={formData.type === '매도'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                        />
                                        <span className="text-sm text-slate-700">매도</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">자산 선택</label>
                                <select
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                >
                                    <option>삼성전자 (KRW)</option>
                                    <option>애플 (USD)</option>
                                    <option>비트코인 (BTC)</option>
                                    <option>이더리움 (ETH)</option>
                                    <option>테슬라 (USD)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">수량</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="수량"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">단가</label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="단가"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">거래 날짜</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">수수료</label>
                                    <input
                                        type="number"
                                        name="fee"
                                        value={formData.fee}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    거래 추가
                                </button>
                                <button type="button" className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                    초기화
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Impact Preview */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">포트폴리오 영향 미리보기</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">현재 총 자산 가치</span>
                                <span className="font-medium text-slate-900">{formatCurrency(portfolioSummary?.totalValue || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">예상 변동액</span>
                                <span className="font-medium text-emerald-600">
                                    {formData.type === '매수' ? '+' : '-'}{formatCurrency(expectedChange)}
                                </span>
                            </div>
                            <div className="border-t border-slate-100 my-2 pt-2 flex justify-between text-base">
                                <span className="font-medium text-slate-900">최종 예상 가치</span>
                                <span className="font-bold text-slate-900">
                                    {formatCurrency((portfolioSummary?.totalValue || 0) + (formData.type === '매수' ? expectedChange : -expectedChange))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">거래 내역</h2>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="자산, 유형 또는 ID 검색..."
                                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                                    />
                                </div>
                                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">거래 ID</th>
                                        <th className="px-4 py-3 font-medium">거래일</th>
                                        <th className="px-4 py-3 font-medium">자산명</th>
                                        <th className="px-4 py-3 font-medium">유형</th>
                                        <th className="px-4 py-3 font-medium text-right">수량</th>
                                        <th className="px-4 py-3 font-medium text-right">단가</th>
                                        <th className="px-4 py-3 font-medium text-right">총액</th>
                                        <th className="px-4 py-3 font-medium text-center">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transactions.map((tx) => (
                                        <Transaction key={tx.id} tx={tx} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;

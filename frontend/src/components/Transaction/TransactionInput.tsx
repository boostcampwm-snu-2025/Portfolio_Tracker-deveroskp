import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { TransactionType } from '../../types';

const TransactionInput = () => {
    const { addTransaction, portfolioSummary } = usePortfolio();
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

        // Reset form after submit (optional but good UX)
        setFormData({
            type: '매수',
            asset: '삼성전자 (KRW)',
            amount: '',
            price: '',
            date: new Date().toISOString().split('T')[0],
            fee: '',
        });
    };

    return (
        <div className="space-y-6">
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
                        <button type="button"
                            onClick={() => setFormData({
                                type: '매수',
                                asset: '삼성전자 (KRW)',
                                amount: '',
                                price: '',
                                date: new Date().toISOString().split('T')[0],
                                fee: '',
                            })}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            초기화
                        </button>
                    </div>
                </form>
            </div>

            {/* Impact Preview moved here as it depends on local state */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">포트폴리오 영향 미리보기</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">현재 총 자산 가치</span>
                        <span className="font-medium text-slate-900">{formatNumber(portfolioSummary?.totalValue || 0)}</span>
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
    );
};

export default TransactionInput;
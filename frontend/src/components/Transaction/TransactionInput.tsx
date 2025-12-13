import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useYahooQuote } from '../../hooks/useYahooQuote';
import type { TransactionType } from '../../types';

const TransactionInput = () => {
    const { addTransaction, portfolioSummary } = usePortfolio();
    const [formData, setFormData] = useState({
        type: '매수',
        asset: '삼성전자',
        amount: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        fee: '',
    });

    // Fetch current price for selected asset
    const { data: quoteData, isLoading: isLoadingQuote } = useYahooQuote(formData.asset);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isDepositOrWithdraw = formData.type === '입금' || formData.type === '출금';

    const safeParse = (val: string) => parseFloat(val.replace(/,/g, '')) || 0;
    const expectedChange = isDepositOrWithdraw
        ? safeParse(formData.amount)
        : safeParse(formData.amount) * safeParse(formData.price) + safeParse(formData.fee);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalAsset = isDepositOrWithdraw ? '현금' : formData.asset;
        const finalPrice = isDepositOrWithdraw ? 1 : Number(formData.price);
        const finalAmount = Number(formData.amount);

        const newTx: TransactionType = {
            id: `tx${Date.now()}`,
            date: formData.date,
            type: formData.type,
            asset: finalAsset,
            amount: finalAmount,
            price: finalPrice,
            total: finalAmount * finalPrice,
            fee: isDepositOrWithdraw ? 0 : (Number(formData.fee) || 0),
            status: '완료',
        };
        addTransaction(newTx);

        // Reset form
        setFormData({
            type: formData.type, // Keep the same type
            asset: '삼성전자',
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
                    {/* Transaction Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">거래 유형</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['매수', '매도', '입금', '출금'].map((type) => (
                                <label
                                    key={type}
                                    className={`flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer transition-all
                                        ${formData.type === type
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-primary/50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Form Fields */}
                    {isDepositOrWithdraw ? (
                        /* Deposit/Withdrawal: Only Amount and Date */
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">금액</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="금액을 입력하세요"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">거래 날짜</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        /* Buy/Sell: Full Form */
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">자산 선택</label>
                                <select
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                >
                                    <option>삼성전자</option>
                                    <option>카카오</option>
                                    <option>애플</option>
                                    <option>테슬라</option>
                                    <option>비트코인</option>
                                    <option>이더리움</option>
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
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        단가
                                        {isLoadingQuote && <span className="ml-2 text-xs text-slate-400">시세 로딩중...</span>}
                                        {quoteData && <span className="ml-2 text-xs text-emerald-600">현재가: {formatNumber(quoteData.regularMarketPrice)}</span>}
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder={quoteData ? `현재가 ${formatNumber(quoteData.regularMarketPrice)}` : '단가'}
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">거래 날짜</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                        required
                                    />
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
                        </>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            {isDepositOrWithdraw ? (formData.type === '입금' ? '입금하기' : '출금하기') : '거래 추가'}
                        </button>
                        <button type="button"
                            onClick={() => setFormData({
                                type: formData.type,
                                asset: '삼성전자',
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

            {/* Impact Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">포트폴리오 영향 미리보기</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">현재 총 자산 가치</span>
                        <span className="font-medium text-slate-900">{formatNumber(portfolioSummary?.totalValue || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">예상 변동액</span>
                        <span className={`font-medium ${(formData.type === '매수' || formData.type === '출금') ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {(formData.type === '입금' || formData.type === '매도') ? '+' : '-'}{formatCurrency(expectedChange)}
                        </span>
                    </div>
                    <div className="border-t border-slate-100 my-2 pt-2 flex justify-between text-base">
                        <span className="font-medium text-slate-900">최종 예상 가치</span>
                        <span className="font-bold text-slate-900">
                            {formatCurrency((portfolioSummary?.totalValue || 0) +
                                ((formData.type === '입금' || formData.type === '매도') ? expectedChange : -expectedChange))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionInput;
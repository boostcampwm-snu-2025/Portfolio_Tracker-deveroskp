import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useYahooQuote } from '../../hooks/useYahooQuote';
import { getYahooSymbol } from '../../services/yahooFinance';
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

    const availableCash = portfolioSummary?.cash || 0;

    // Fetch current price for selected asset
    const { data: quoteData, isLoading: isLoadingQuote } = useYahooQuote(formData.asset);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isDepositOrWithdraw = formData.type === '입금' || formData.type === '출금';

    const safeParse = (val: string) => parseFloat(val.replace(/,/g, '')) || 0;
    
    let expectedChange = 0;
    if (isDepositOrWithdraw) {
        expectedChange = safeParse(formData.amount);
    } else if (formData.type === '매수') {
        expectedChange = safeParse(formData.amount) * safeParse(formData.price) + safeParse(formData.fee);
    } else {
        // 매도: (수량 * 단가) - 수수료
        expectedChange = safeParse(formData.amount) * safeParse(formData.price) - safeParse(formData.fee);
    }
    
    const isInsufficientCash = (formData.type === '매수' || formData.type === '출금') && expectedChange > availableCash;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isInsufficientCash) {
            alert('보유 현금이 부족합니다.');
            return;
        }

        const finalAsset = isDepositOrWithdraw ? '현금' : formData.asset;
        const finalPrice = isDepositOrWithdraw ? 1 : Number(formData.price);
        const finalAmount = Number(formData.amount);

        const ticker = getYahooSymbol(finalAsset);

        const newTx: TransactionType = {
            id: `tx${Date.now()}`,
            date: formData.date,
            type: formData.type,
            asset: finalAsset,
            ticker: ticker || undefined,
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
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">거래 유형</label>
                            <span className="text-xs text-slate-500 font-medium">
                                보유 현금: <span className="text-emerald-600">{formatCurrency(availableCash)}</span>
                            </span>
                        </div>
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

                    {/* Warning for insufficient cash */}
                    {isInsufficientCash && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>보유 현금이 부족합니다. (필요: {formatCurrency(expectedChange)})</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit" 
                            disabled={isInsufficientCash}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${isInsufficientCash 
                                    ? 'bg-slate-300 text-white cursor-not-allowed' 
                                    : 'bg-primary text-white hover:bg-blue-700'
                                }`}
                        >
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
        </div>
    );
};

export default TransactionInput;
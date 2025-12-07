import { Search, Filter } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Transaction from '../components/Transaction';
import TransactionInput from '../components/TransactionInput';

const Transactions = () => {
    const { transactions, loading } = usePortfolio();

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
                <div className="lg:col-span-1">
                    <TransactionInput />
                </div>
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


import { usePortfolio } from '../../context/PortfolioContext';
import TransactionItem from './TransactionItem';
import TransactionHeader from './TransactionHeader';

const TransactionList = () => {
    const { transactions } = usePortfolio();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <TransactionHeader />
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-4 py-3 font-medium">거래 ID</th>
                            <th className="px-4 py-3 font-medium">거래일</th>
                            <th className="px-4 py-3 font-medium">종목명</th>
                            <th className="px-4 py-3 font-medium">유형</th>
                            <th className="px-4 py-3 font-medium text-right">수량</th>
                            <th className="px-4 py-3 font-medium text-right">단가</th>
                            <th className="px-4 py-3 font-medium text-right">총액</th>
                            <th className="px-4 py-3 font-medium text-center">상태</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                            <TransactionItem key={tx.id} tx={tx} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;

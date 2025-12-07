import { usePortfolio } from '../context/PortfolioContext';
import TransactionList from '../components/Transaction/TransactionList';
import TransactionInput from '../components/Transaction/TransactionInput';

const Transactions = () => {
    const { loading } = usePortfolio();

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
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};

export default Transactions;


import { Search, Filter } from 'lucide-react';

const TransactionHeader = () => {
    return (
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
    );
};

export default TransactionHeader;

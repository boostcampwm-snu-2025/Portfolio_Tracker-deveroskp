import type { TransactionType } from "../../types";
import { formatCurrency } from "../../utils/formatters";

const Transaction = ({ tx }: { tx: TransactionType }) => {
    return (
        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-4 py-3 text-slate-500">{tx.id}</td>
            <td className="px-4 py-3 text-slate-900">{tx.date}</td>
            <td className="px-4 py-3 font-medium text-slate-900">{tx.asset}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.type === '매수' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                    {tx.type}
                </span>
            </td>
            <td className="px-4 py-3 text-right text-slate-600">{tx.amount}</td>
            <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(tx.price)}</td>
            <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(tx.total)}</td>
            <td className="px-4 py-3 text-center">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {tx.status}
                </span>
            </td>
        </tr>
    )
}

export default Transaction

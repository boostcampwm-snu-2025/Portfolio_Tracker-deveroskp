import { Newspaper, ExternalLink } from "lucide-react";
import { useMarketNews } from "../hooks/useNews";

const Notification = () => {
    const { data: newsItems, isLoading: isNewsLoading, error: newsError } = useMarketNews();
    return (
        <div className="h-full flex flex-col">
            <div className="drag-handle cursor-move pb-2 mb-2 border-b border-slate-50 -mx-6 px-6 pt-2 -mt-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-slate-500" />
                        주요 증권 소식
                    </h2>
                    <span className="text-xs text-slate-400">Finnhub 제공</span>
                </div>
            </div>
            <div className="space-y-4 flex-1 overflow-auto">

                {isNewsLoading && (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        뉴스를 불러오는 중...
                    </div>
                )}

                {newsError && (
                    <div className="text-center py-4 text-red-400 text-sm">
                        뉴스를 불러오는데 실패했습니다.
                    </div>
                )}

                {!isNewsLoading && !newsError && newsItems && newsItems.slice(0, 5).map((item) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 group hover:bg-slate-50 p-2 -mx-2 rounded transition-colors"
                    >
                        <div className="mt-1 flex-shrink-0">
                            <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Newspaper className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                                {item.headline}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-slate-400">{item.source}</p>
                                <span className="text-slate-300 text-xs">•</span>
                                <p className="text-xs text-slate-400">
                                    {new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                        </div>
                    </a>
                ))}

                {!isNewsLoading && !newsError && (!newsItems || newsItems.length === 0) && (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        표시할 뉴스가 없습니다.
                    </div>
                )}

            </div>
        </div>
    );
};

export default Notification;

// React import removed
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, BarChart2, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: '대시보드' },
        { path: '/transactions', icon: List, label: '거래 내역' },
        { path: '/rebalancing', icon: BarChart2, label: '리밸런싱' },
    ];

    return (
        <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <BarChart2 className="w-6 h-6" />
                    AssetPilot
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-slate-100 text-primary font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

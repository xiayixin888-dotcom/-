import { Outlet, NavLink } from 'react-router-dom';
import { MessageCircle, Users, Settings, Network } from 'lucide-react';
import FloatingAssistant from './Assistant/FloatingAssistant';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar Navigation (Rail) */}
      <aside className="w-[68px] bg-white border-r border-slate-200 flex flex-col shrink-0 items-center py-0 z-20">
        <nav className="flex-1 flex flex-col w-full mt-4">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-full h-16 transition-colors ${
                isActive ? 'bg-[#eef4ff]' : 'hover:bg-slate-50'
              }`
            }
            title="会话工作台"
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}
                <div className="relative">
                  <MessageCircle size={26} className={isActive ? "text-blue-500" : "text-slate-500"} strokeWidth={1.5} />
                  <Network size={12} className={`absolute -bottom-1 -right-2 ${isActive ? "text-blue-500" : "text-slate-500"}`} strokeWidth={2} />
                </div>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/audience"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-full h-16 transition-colors ${
                isActive ? 'bg-[#eef4ff]' : 'hover:bg-slate-50'
              }`
            }
            title="人群洞察"
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}
                <div className="relative">
                  <Users size={26} className={isActive ? "text-blue-500" : "text-slate-500"} strokeWidth={1.5} />
                  <Network size={12} className={`absolute -bottom-1 -right-2 ${isActive ? "text-blue-500" : "text-slate-500"}`} strokeWidth={2} />
                </div>
              </>
            )}
          </NavLink>
        </nav>
        
        <div className="mt-auto mb-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <Settings size={22} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Outlet />
      </main>

      {/* Floating Assistant */}
      <FloatingAssistant />
    </div>
  );
}

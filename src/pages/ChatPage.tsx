import { Search, ChevronDown, Image, Layers, Bot, Users, Send, MessageSquare, ListTodo, X, ListFilter, LayoutGrid, Headset, FileQuestion, Inbox, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TaskCenter from './TaskCenter';
import AudienceInsights from './AudienceInsights';

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = location.pathname.includes('tasks') ? 'tasks' 
                  : location.pathname.includes('audience') ? 'audience' 
                  : 'chat';

  const setActiveTab = (tab: string) => {
    if (tab === 'chat') navigate('/chat');
    if (tab === 'tasks') navigate('/tasks');
    if (tab === 'audience') navigate('/audience');
  };

  const tabs = [
    { id: 'chat', label: '薰风满莲渡玉兰香', type: 'chat' },
    { id: 'tasks', label: '推送任务', type: 'tasks' },
    { id: 'audience', label: '人群洞察', type: 'audience' }
  ];

  return (
    <div className="flex h-full w-full bg-slate-100 overflow-hidden">
      {/* Groups Panel */}
      <div className="w-48 bg-[#f4f8fb] border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-2 px-5 text-slate-800 font-bold text-base shrink-0 mt-2">
          <ListFilter size={18} className="text-slate-700" /> 会话分组
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <GroupItem icon={<LayoutGrid size={16}/>} label="全部" active />
          <GroupItem icon={<Headset size={16}/>} label="当前接待" hasDropdown />
          <GroupItem icon={<FileQuestion size={16}/>} label="线索待判定" />
          <GroupItem icon={<Inbox size={16}/>} label="线索待派发" />
          <GroupItem icon={<Clock size={16}/>} label="待跟进需求" hasDropdown />
        </div>
      </div>

      {/* Left Panel: Chat List */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">全部会话</h2>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="搜索客户名称" 
                className="w-full pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <Search size={16} className="absolute right-2.5 top-2 text-slate-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50">
              <span className="text-slate-600">城市</span>
              <div className="flex items-center gap-1 text-slate-800">全国 <ChevronDown size={14} className="text-slate-400"/></div>
            </div>
            <div className="flex justify-between items-center text-sm border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50">
              <span className="text-slate-600">客服名称</span>
              <div className="flex items-center gap-1 text-slate-400">请选择 <ChevronDown size={14}/></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs font-medium text-slate-500">
            <div className="flex gap-3">
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md cursor-pointer">只看我的</span>
              <span className="hover:bg-slate-100 px-2 py-1 rounded-md cursor-pointer">未读</span>
            </div>
            <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700"><Layers size={14}/> 最新消息</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Chat List Items */}
          <ChatItem name="365淘房翟经理~无锡房产" msg="线索回复一下" time="18:00" tag="AI线索" active />
          <ChatItem name="仔妈🌸" msg="好的" time="18:00" tag="小B" />
          <ChatItem name="快乐每一天" msg="帮您匹配一下房源" time="18:00" tag="小B" />
          <ChatItem name="张良琴" msg="3房带电梯，价格200上下" time="17:58" tag="AI" />
          <ChatItem name="薰风满莲渡玉兰香" msg="小三房，城南附近" time="17:59" tag="AI" />
          <ChatItem name="冒我华" msg="靠近地铁" time="17:59" tag="AI" />
          <ChatItem name="......." msg="您是考虑商品房还是安置房？" time="17:59" tag="小B" />
        </div>
      </div>

      {/* Middle Panel: Chat Window / Tabs Content */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative min-w-0">
        {/* Browser-like Tabs */}
        <div className="flex items-end px-2 pt-2 bg-slate-200 border-b border-slate-300 gap-1 shrink-0">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg flex items-center gap-2 text-sm cursor-pointer border-t border-x transition-colors ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 border-slate-200 font-medium z-10' 
                  : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-50'
              }`}
            >
              {tab.type === 'chat' && <MessageSquare size={14} />}
              {tab.type === 'tasks' && <ListTodo size={14} />}
              {tab.type === 'audience' && <Users size={14} />}
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              薰风满莲渡玉兰香 <span className="text-emerald-500">●</span>
            </h2>
            <p className="text-xs text-slate-500">苏州 | 房博士-小文 | 光年选房专家</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
              <Bot size={16} /> 有效会话线索
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              转发
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center text-xs text-slate-400 my-4">2026-02-25 17:56:47 转AI接待</div>
          
          {/* AI Message */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <Bot size={20} />
            </div>
            <div className="flex flex-col max-w-[70%]">
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-xs font-medium text-slate-500">房博士-小文</span>
                <span className="text-[10px] text-slate-400">17:56:57</span>
              </div>
              <div className="p-3 bg-blue-50 text-slate-800 rounded-2xl rounded-tl-sm border border-blue-100 text-sm leading-relaxed">
                您好！扎根苏州楼市13年，我对各区房源都门儿清，找我选房帮您省心更避坑。
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <Bot size={20} />
            </div>
            <div className="flex flex-col max-w-[70%]">
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-xs font-medium text-slate-500">房博士-小文</span>
                <span className="text-[10px] text-slate-400">17:57:10</span>
              </div>
              <div className="p-3 bg-blue-50 text-slate-800 rounded-2xl rounded-tl-sm border border-blue-100 text-sm leading-relaxed">
                年初苏州市场回暖，房东陆续挂牌了不少优质新房源，但也需谨慎挑选。您目前主要关注哪个板块？我可以帮您把把关。
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-3 flex-row-reverse">
            <img src="https://picsum.photos/seed/user1/100/100" alt="User" className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            <div className="flex flex-col items-end max-w-[70%]">
              <div className="flex items-center gap-2 mb-1 pr-1">
                <span className="text-[10px] text-slate-400">17:57:40</span>
                <span className="text-xs font-medium text-slate-500">薰风满莲渡玉兰香</span>
              </div>
              <div className="p-3 bg-white text-slate-800 rounded-2xl rounded-tr-sm border border-slate-200 text-sm leading-relaxed shadow-sm">
                苏州吴中区
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200">
              <Bot size={20} />
            </div>
            <div className="flex flex-col max-w-[70%]">
              <div className="flex items-center gap-2 mb-1 pl-1">
                <span className="text-xs font-medium text-slate-500">房博士-小文</span>
                <span className="text-[10px] text-slate-400">17:59:31</span>
              </div>
              <div className="p-3 bg-blue-50 text-slate-800 rounded-2xl rounded-tl-sm border border-blue-100 text-sm leading-relaxed">
                吴中区配套成熟，确实是安家的好选择。我手里正好整理了几套性价比极高的急售房源，为了精准匹配，您是考虑三房还是两房？
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-row-reverse">
            <img src="https://picsum.photos/seed/user1/100/100" alt="User" className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            <div className="flex flex-col items-end max-w-[70%]">
              <div className="flex items-center gap-2 mb-1 pr-1">
                <span className="text-[10px] text-slate-400">17:59:55</span>
                <span className="text-xs font-medium text-slate-500">薰风满莲渡玉兰香</span>
              </div>
              <div className="p-3 bg-white text-slate-800 rounded-2xl rounded-tr-sm border border-slate-200 text-sm leading-relaxed shadow-sm">
                小三房，城南附近
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="h-40 bg-white border-t border-slate-200 p-4 flex flex-col shrink-0">
          <div className="flex gap-4 mb-2">
            <button className="flex items-center gap-1 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <Bot size={16} /> 快捷话术
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Image size={18} /></button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Layers size={18} /></button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Users size={18} /></button>
          </div>
          <textarea 
            className="flex-1 w-full resize-none border-none focus:ring-0 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent p-0"
            placeholder="输入回复内容..."
          />
          <div className="flex justify-end mt-2">
            <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
          </div>
        )}
        {activeTab === 'tasks' && <TaskCenter />}
        {activeTab === 'audience' && <AudienceInsights />}
      </div>

      {/* Right Panel: Customer Profile */}
      {activeTab === 'chat' && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
          <div className="p-4 border-b border-slate-100">
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">客户档案</button>
            <button className="flex-1 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">客户画像</button>
            <button className="flex-1 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md">客户行为</button>
          </div>
          <div className="flex gap-3 items-center">
            <img src="https://picsum.photos/seed/user1/100/100" alt="User" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <h3 className="font-semibold text-slate-800">薰风满莲渡玉兰香</h3>
              <div className="flex gap-1 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">未在群</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">未授权</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">基础信息</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">手机号码:</span>
              <span className="text-slate-800 flex items-center gap-1">--- <Layers size={12} className="text-slate-400 cursor-pointer"/></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">base_id:</span>
              <span className="text-slate-800 flex items-center gap-1 truncate max-w-[150px]">1729558178787317586 <Layers size={12} className="text-slate-400 cursor-pointer shrink-0"/></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">unionid:</span>
              <span className="text-slate-800 flex items-center gap-1 truncate max-w-[150px]">obs_rt8CkqOQ7aQYylAM... <Layers size={12} className="text-slate-400 cursor-pointer shrink-0"/></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">788ID:</span>
              <span className="text-slate-800 flex items-center gap-1 truncate max-w-[150px]">7881300133920702 <Layers size={12} className="text-slate-400 cursor-pointer shrink-0"/></span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">客户标签</h4>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">高意向</span>
            <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-md border border-orange-100">三居室</span>
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">吴中区</span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-slate-800">跟进备注</h4>
            <div className="flex gap-3 text-xs text-blue-600 font-medium">
              <span className="cursor-pointer flex items-center gap-0.5">+ 添加</span>
              <span className="cursor-pointer">查看全部</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <Layers size={24} className="text-slate-300" />
            </div>
            <p className="text-xs">暂无数据</p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

function GroupItem({ icon, label, active, hasDropdown }: { icon: React.ReactNode, label: string, active?: boolean, hasDropdown?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors ${
      active ? 'text-blue-500' : 'text-slate-600 hover:bg-slate-100/50'
    }`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
    </div>
  );
}

function ChatItem({ name, msg, time, tag, active = false }: { name: string, msg: string, time: string, tag: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-l-2 ${
      active ? 'bg-blue-50 border-blue-600' : 'hover:bg-slate-50 border-transparent'
    }`}>
      <div className="relative shrink-0">
        <img src={`https://picsum.photos/seed/${name}/100/100`} alt={name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
        <span className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-600 shadow-sm">
          {tag}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-sm font-medium text-slate-800 truncate pr-2">{name}</h3>
          <span className="text-xs text-slate-400 shrink-0">{time}</span>
        </div>
        <p className="text-xs text-slate-500 truncate">{msg}</p>
      </div>
    </div>
  );
}

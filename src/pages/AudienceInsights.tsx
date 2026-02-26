import { useState } from 'react';
import { Search, Filter, Download, User, Tag, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

const MOCK_AUDIENCE = [
  { id: 'C-001', name: '张女士', phone: '138****1234', agent: '房博士-小文', tags: ['高意向', '近期活跃', '三居室'], city: '南京', lastActive: '2小时前' },
  { id: 'C-002', name: '李先生', phone: '139****5678', agent: '光年选房专家', tags: ['沉睡唤醒', '价格敏感'], city: '南京', lastActive: '1天前' },
  { id: 'C-003', name: '王女士', phone: '137****9012', agent: '房博士-小李', tags: ['学区房', '急购'], city: '南京', lastActive: '3小时前' },
  { id: 'C-004', name: '赵先生', phone: '136****3456', agent: '房博士-小文', tags: ['投资客', '全款'], city: '南京', lastActive: '5天前' },
  { id: 'C-005', name: '刘女士', phone: '135****7890', agent: '光年选房专家', tags: ['改善型', '四居室'], city: '南京', lastActive: '10分钟前' },
];

export default function AudienceInsights() {
  const [audience] = useState(MOCK_AUDIENCE);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  return (
    <div className="flex-1 h-full bg-slate-50 p-6 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">人群洞察</h1>
            <p className="text-sm text-slate-500 mt-1">查看由 365私域管家 圈选的目标人群详情</p>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex items-start gap-3 shrink-0">
          <div className="mt-0.5 text-indigo-500">
            <Filter size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 mb-1">当前人群筛选条件（365私域管家 自动生成）</h3>
            <p className="text-sm text-indigo-700 leading-relaxed">
              “南京地区 30 天内活跃客户，且带有‘高意向’或‘近期活跃’标签，排除已成交客户。”
            </p>
            <div className="mt-3 flex gap-4 text-xs font-medium text-indigo-600">
              <span className="bg-white/60 px-2 py-1 rounded-md border border-indigo-100">总人数：1,245</span>
              <span className="bg-white/60 px-2 py-1 rounded-md border border-indigo-100">覆盖率：15.2%</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Table */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="搜索客户姓名或手机号..." 
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="text-sm text-slate-500">
                显示 1-5 条，共 1,245 条
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">客户信息</th>
                    <th className="p-4">所属客服</th>
                    <th className="p-4">命中标签</th>
                    <th className="p-4">最后活跃</th>
                    <th className="p-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {audience.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedCustomer === customer.id ? 'bg-indigo-50/50' : ''}`}
                      onClick={() => setSelectedCustomer(customer.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://picsum.photos/seed/${customer.id}/100/100`} alt={customer.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-medium text-slate-800 text-sm">{customer.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{customer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <User size={14} className="text-slate-400" />
                          {customer.agent}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {customer.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded border border-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock size={14} className="text-slate-400" />
                          {customer.lastActive}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel (Mock) */}
          {selectedCustomer && (
            <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto shrink-0 flex flex-col animate-in slide-in-from-right-4 duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-semibold text-slate-800">客户档案</h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  关闭
                </button>
              </div>
              
              {audience.find(c => c.id === selectedCustomer) && (
                <div className="p-6 flex flex-col items-center border-b border-slate-100">
                  <img 
                    src={`https://picsum.photos/seed/${selectedCustomer}/150/150`} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-3"
                    referrerPolicy="no-referrer"
                  />
                  <h2 className="text-lg font-bold text-slate-800">{audience.find(c => c.id === selectedCustomer)?.name}</h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={14} /> {audience.find(c => c.id === selectedCustomer)?.city}
                  </p>
                </div>
              )}

              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">基础信息</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">手机号</span>
                      <span className="font-medium text-slate-800">{audience.find(c => c.id === selectedCustomer)?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">所属客服</span>
                      <span className="font-medium text-slate-800">{audience.find(c => c.id === selectedCustomer)?.agent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">注册时间</span>
                      <span className="font-medium text-slate-800 flex items-center gap-1"><Calendar size={14} className="text-slate-400"/> 2025-10-12</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">客户标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {audience.find(c => c.id === selectedCustomer)?.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md border border-indigo-100 flex items-center gap-1">
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">近期动态</h4>
                  <div className="relative pl-4 border-l-2 border-slate-100 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                      <p className="text-xs text-slate-500 mb-0.5">2小时前</p>
                      <p className="text-sm text-slate-800">浏览了 <span className="text-indigo-600 font-medium cursor-pointer">吴中区·星河湾</span> 楼盘详情页</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                      <p className="text-xs text-slate-500 mb-0.5">昨天 14:30</p>
                      <p className="text-sm text-slate-800">与客服 <span className="font-medium">房博士-小文</span> 进行了 5 分钟的沟通</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

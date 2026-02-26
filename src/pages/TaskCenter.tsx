import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react';

const MOCK_TASKS = [
  { id: 'T-20260225-001', type: '私聊推送', account: '房博士-小文', content: '【新盘推荐】吴中区高性价比三居室...', time: '2026-02-25 10:30', total: 1245, success: 1200, failed: 5, pending: 40, status: 'processing' },
  { id: 'T-20260225-002', type: '朋友圈推送', account: '光年选房专家', content: '春季看房节，多重好礼等你来拿！', time: '2026-02-25 09:15', total: 5000, success: 5000, failed: 0, pending: 0, status: 'done' },
  { id: 'T-20260224-003', type: '群聊推送', account: '房博士-小李', content: '本周六看房团报名开始啦，点击链接...', time: '2026-02-24 16:45', total: 30, success: 28, failed: 2, pending: 0, status: 'done' },
  { id: 'T-20260224-004', type: '私聊推送', account: '房博士-小文', content: '您的专属购房报告已生成，请查收。', time: '2026-02-24 14:20', total: 850, success: 800, failed: 50, pending: 0, status: 'error' },
];

export default function TaskCenter() {
  const [tasks] = useState(MOCK_TASKS);

  return (
    <div className="flex-1 h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">推送任务列表</h1>
            <p className="text-sm text-slate-500 mt-1">管理和监控由 365私域管家 创建的自动化推送任务</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索任务 ID、内容或账号..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter size={16} /> 筛选
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">任务 ID / 类型</th>
                  <th className="p-4">执行账号</th>
                  <th className="p-4 min-w-[200px]">推送内容预览</th>
                  <th className="p-4">创建时间</th>
                  <th className="p-4 min-w-[250px]">执行进度</th>
                  <th className="p-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-800 text-sm">{task.id}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          task.type === '私聊推送' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          task.type === '群聊推送' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {task.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {task.account.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700">{task.account}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600 line-clamp-2 max-w-xs" title={task.content}>
                        {task.content}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {task.time}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">总计: <span className="font-medium text-slate-700">{task.total}</span></span>
                          <div className="flex gap-2">
                            <span className="text-emerald-600" title="成功">{task.success}</span>
                            <span className="text-orange-500" title="失败">{task.failed}</span>
                            <span className="text-slate-400" title="待发送">{task.pending}</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500" style={{ width: `${(task.success / task.total) * 100}%` }} />
                          <div className="h-full bg-orange-500" style={{ width: `${(task.failed / task.total) * 100}%` }} />
                          <div className="h-full bg-slate-300" style={{ width: `${(task.pending / task.total) * 100}%` }} />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-medium mt-0.5">
                          {task.status === 'processing' && <><Play size={10} className="text-indigo-500"/> <span className="text-indigo-600">执行中</span></>}
                          {task.status === 'done' && <><CheckCircle2 size={10} className="text-emerald-500"/> <span className="text-emerald-600">已完成</span></>}
                          {task.status === 'error' && <><AlertCircle size={10} className="text-orange-500"/> <span className="text-orange-600">部分失败</span></>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
            <span>共 4 条记录</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">上一页</button>
              <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50">下一页</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

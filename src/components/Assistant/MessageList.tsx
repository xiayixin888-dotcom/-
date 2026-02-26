import { useEffect, useRef } from 'react';
import { Bot, User, CheckCircle2, CircleDashed, Loader2, AlertCircle } from 'lucide-react';
import { Message, Task, AudienceCardData } from '../../types';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onAudienceConfirm: () => void;
  onAudienceReject: () => void;
  onProfileClick?: (id: string) => void;
  onActionClick?: (action: string) => void;
}

export default function MessageList({ messages, isTyping, onAudienceConfirm, onAudienceReject, onProfileClick, onActionClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          <div className="shrink-0 mt-1">
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                <Bot size={18} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shadow-sm border border-slate-300">
                <User size={18} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-medium text-slate-500">
                {msg.role === 'assistant' ? '365私域管家' : '我'}
              </span>
              <span className="text-[10px] text-slate-400">
                {format(msg.timestamp, 'HH:mm')}
              </span>
            </div>

            <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : msg.isError 
                  ? 'bg-orange-50 text-orange-900 border border-orange-200 rounded-tl-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>

            {/* Task Progress Component */}
            {msg.tasks && (
              <div className="mt-3 w-full bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <div className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-indigo-500" />
                  任务流水线执行中
                </div>
                <div className="space-y-3 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200" />
                  
                  {msg.tasks.map((task, index) => (
                    <div key={task.id} className="flex items-start gap-3 relative z-10">
                      <div className="shrink-0 mt-0.5 bg-white">
                        {task.status === 'done' ? (
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        ) : task.status === 'processing' ? (
                          <Loader2 size={20} className="text-indigo-500 animate-spin" />
                        ) : (
                          <CircleDashed size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-medium ${
                            task.status === 'done' ? 'text-slate-700' : 
                            task.status === 'processing' ? 'text-indigo-700' : 'text-slate-400'
                          }`}>
                            {index + 1}. {task.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {task.status === 'done' ? '已完成' : 
                             task.status === 'processing' ? `${task.progress}%` : '等待中'}
                          </span>
                        </div>
                        {task.status === 'processing' && (
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audience Preview Card Component */}
            {msg.audienceCard && (
              <div className="mt-3 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-800">人群圈选结果</span>
                  <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    共 {msg.audienceCard.totalCount.toLocaleString()} 人
                  </span>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="text-xs text-slate-500 mb-2">抽样预览 (3人)：</div>
                  {msg.audienceCard.samples.map(sample => (
                    <div key={sample.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => onProfileClick && onProfileClick(sample.id)}>
                      <img src={sample.avatar} alt={sample.name} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-800 truncate">{sample.name}</span>
                          <div className="flex gap-1 overflow-x-auto no-scrollbar">
                            {sample.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 whitespace-nowrap">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-2 bg-white p-2 rounded border border-slate-100 mt-1.5">
                          <span className="font-medium text-slate-600">理由：</span>{sample.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={onAudienceReject}
                    className="flex-1 py-2 px-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    不对，重新调整
                  </button>
                  <button 
                    onClick={onAudienceConfirm}
                    className="flex-1 py-2 px-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    确认，继续任务
                  </button>
                </div>
              </div>
            )}

            {/* Copy Card Component */}
            {msg.copyCard && (
              <div className="mt-3 w-full space-y-3">
                {(Array.isArray(msg.copyCard) ? msg.copyCard : [msg.copyCard]).map((card, idx) => card && (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-medium text-sm text-slate-700">{card.type}</div>
                    <div className="p-4 text-sm text-slate-600 whitespace-pre-wrap">{card.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Confirm Card Component */}
            {msg.confirmCard && (
              <div className="mt-3 w-full space-y-3">
                {(Array.isArray(msg.confirmCard) ? msg.confirmCard : [msg.confirmCard]).map((card, idx) => card && (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 font-medium text-sm text-indigo-800 flex items-center gap-2">
                      <AlertCircle size={16} /> {card.title}
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">发送人数：</span><span className="font-medium text-slate-800">{card.count} 人</span></div>
                      {card.target && <div className="flex justify-between"><span className="text-slate-500">发送目标：</span><span className="font-medium text-slate-800">{card.target}</span></div>}
                      <div>
                        <span className="text-slate-500">内容快照：</span>
                        <div className="mt-1 p-2 bg-slate-50 rounded border border-slate-100 text-slate-600 line-clamp-2">{card.contentSnapshot}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {msg.actionButtons && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {msg.actionButtons.map((btn, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onActionClick && onActionClick(btn.action)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors shadow-sm ${btn.primary ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Bot size={18} />
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

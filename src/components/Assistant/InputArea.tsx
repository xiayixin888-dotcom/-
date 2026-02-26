import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Command, AtSign, Image as ImageIcon, Paperclip, Smile } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (content: string) => void;
  disabled?: boolean;
}

const SKILLS = [
  { id: 's1', name: '圈人群包', desc: '根据条件筛选目标客户' },
  { id: 's2', name: '私聊推送', desc: '向指定客户发送一对一消息' },
  { id: 's3', name: '群聊推送', desc: '向指定客户群发送消息' },
  { id: 's4', name: '内容生成', desc: 'AI 生成营销文案或话术' },
  { id: 's5', name: '朋友圈推送', desc: '发布朋友圈营销内容' },
];

const AUDIENCES = [
  { id: 'a1', name: '南京高意向客户', count: 1245 },
  { id: 'a2', name: '近30天未复购老客', count: 342 },
  { id: 'a3', name: '三居室意向人群', count: 89 },
];

export default function InputArea({ value, onChange, onSend, disabled }: InputAreaProps) {
  const [showSkills, setShowSkills] = useState(false);
  const [showAudiences, setShowAudiences] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);

    // Check for triggers
    const lastWord = val.split(' ').pop() || '';
    
    if (lastWord.startsWith('/')) {
      setShowSkills(true);
      setShowAudiences(false);
      setSelectedIndex(0);
    } else if (lastWord.startsWith('@')) {
      setShowAudiences(true);
      setShowSkills(false);
      setSelectedIndex(0);
    } else {
      setShowSkills(false);
      setShowAudiences(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSkills || showAudiences) {
      const list = showSkills ? SKILLS : AUDIENCES;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % list.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(list[selectedIndex].name, showSkills ? '/' : '@');
      } else if (e.key === 'Escape') {
        setShowSkills(false);
        setShowAudiences(false);
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelect = (name: string, trigger: '/' | '@') => {
    const words = value.split(' ');
    words.pop(); // Remove the trigger word
    const newValue = [...words, `${trigger}${name} `].join(' ').trimStart();
    onChange(newValue);
    setShowSkills(false);
    setShowAudiences(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    onChange('');
    setShowSkills(false);
    setShowAudiences(false);
  };

  return (
    <div className="relative border-t border-slate-200 bg-white p-4 shrink-0">
      {/* Autocomplete Popup */}
      <AnimatePresence>
        {(showSkills || showAudiences) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10"
          >
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500 flex items-center gap-2">
              {showSkills ? <Command size={14} /> : <AtSign size={14} />}
              {showSkills ? '选择指令 (Skill)' : '选择人群包 (Audience)'}
            </div>
            <ul className="max-h-48 overflow-y-auto py-1">
              {(showSkills ? SKILLS : AUDIENCES).map((item, idx) => (
                <li
                  key={item.id}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                    idx === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  onClick={() => handleSelect(item.name, showSkills ? '/' : '@')}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-xs text-slate-400">
                    {showSkills ? (item as any).desc : `${(item as any).count} 人`}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box */}
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <div className="flex flex-col gap-2 pb-1 pl-1">
          <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="附件">
            <Paperclip size={18} />
          </button>
        </div>
        
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="输入 / 唤起指令，@ 引用人群包..."
          className="flex-1 max-h-32 min-h-[40px] bg-transparent border-none focus:ring-0 resize-none py-2 px-1 text-sm text-slate-800 placeholder:text-slate-400 disabled:text-slate-700 disabled:bg-transparent"
          rows={1}
          style={{ height: 'auto' }}
        />
        
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
            !disabled && value.trim() 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} className={value.trim() ? 'ml-0.5' : ''} />
        </button>
      </div>
      
      <div className="mt-2 flex justify-between items-center px-1">
        <div className="flex gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 cursor-pointer hover:text-slate-600"><Command size={12}/> 指令</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-slate-600"><AtSign size={12}/> 人群</span>
        </div>
        <span className="text-[10px] text-slate-300">按 Enter 发送，Shift+Enter 换行</span>
      </div>
    </div>
  );
}

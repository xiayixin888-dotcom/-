import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, MessageSquare, Trash2, Bot, History, Play, Pause, Square, ChevronLeft } from 'lucide-react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { Message, Task } from '../../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCENARIOS = [
  { id: 's1', title: '场景一：高意向客户精准触达', desc: '全流程任务追踪、客户画像深挖' },
  { id: 's2', title: '场景二：金融政策即时宣发', desc: '纯自然语言选择账号、文案内容确认' },
  { id: 's3', title: '场景三：跨渠道分发', desc: '朋友圈与群聊的双重账号筛选' },
  { id: 's4', title: '场景四：潜在潜客挖掘', desc: '业务逻辑微调、画像透视纠偏' },
];

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [demoState, setDemoState] = useState<{ isPlaying: boolean; isPaused: boolean; currentScenario: string | null }>({ isPlaying: false, isPaused: false, currentScenario: null });
  const demoRef = useRef({ isPlaying: false, isPaused: false, isStopped: false });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是 365私域管家。您可以直接输入需求，或者使用 `/` 唤起指令，使用 `@` 引用人群包。',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync ref with state
  useEffect(() => {
    demoRef.current = { ...demoState, isStopped: !demoState.isPlaying };
  }, [demoState]);

  const stopDemo = () => {
    setDemoState({ isPlaying: false, isPaused: false, currentScenario: null });
    demoRef.current = { isPlaying: false, isPaused: false, isStopped: true };
  };

  const pauseDemo = () => {
    setDemoState(prev => {
      const next = { ...prev, isPaused: !prev.isPaused };
      demoRef.current = { ...demoRef.current, isPaused: next.isPaused };
      return next;
    });
  };

  const runDemo = async (scenarioId: string) => {
    const newState = { isPlaying: true, isPaused: false, currentScenario: scenarioId };
    setDemoState(newState);
    demoRef.current = { ...newState, isStopped: false };
    setMessages([{ id: '1', role: 'assistant', content: '您好！我是 365私域管家。演示模式已启动。', timestamp: new Date() }]);
    setShowHistory(false);
    
    const sleep = async (ms: number) => {
      let elapsed = 0;
      while (elapsed < ms) {
        if (!demoRef.current.isPlaying) throw new Error('STOPPED');
        if (!demoRef.current.isPaused) elapsed += 100;
        await new Promise(r => setTimeout(r, 100));
      }
    };

    const type = async (text: string) => {
      setInputValue('');
      for (let i = 0; i < text.length; i++) {
        setInputValue(prev => prev + text[i]);
        await sleep(30);
      }
      await sleep(400);
      setInputValue('');
    };

    const userMsg = async (text: string) => {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }]);
      await sleep(600);
    };

    const aiMsg = async (msg: Partial<Message>) => {
      setIsTyping(true);
      await sleep(800);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', timestamp: new Date(), ...msg } as Message]);
      await sleep(800);
    };

    const updateLastAiMsg = async (updater: (msg: Message) => Message) => {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = updater(newMsgs[newMsgs.length - 1]);
        return newMsgs;
      });
      await sleep(800);
    };

    try {
      if (scenarioId === 's1') {
        await type("帮我圈出‘近一个月没互动’且‘高意向’的客户，写一段学区房大促召回文案并私信他们。");
        await userMsg("帮我圈出‘近一个月没互动’且‘高意向’的客户，写一段学区房大促召回文案并私信他们。");
        
        await aiMsg({
          content: '正在为您执行任务流水线：',
          tasks: [
            { id: 't1', name: '圈选客户', status: 'processing', progress: 30 },
            { id: 't2', name: '撰写文案', status: 'pending', progress: 0 },
            { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
          ]
        });

        await sleep(1000);
        await updateLastAiMsg(msg => ({
          ...msg,
          tasks: [
            { id: 't1', name: '圈选客户', status: 'done', progress: 100 },
            { id: 't2', name: '撰写文案', status: 'pending', progress: 0 },
            { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
          ],
          audienceCard: {
            totalCount: 328,
            samples: [
              { id: 'c1', name: '陈先生', avatar: 'https://picsum.photos/seed/c1/100/100', tags: ['高意向', '近一个月没互动'], reason: '32天前咨询过学区房' },
              { id: 'c2', name: '林女士', avatar: 'https://picsum.photos/seed/c2/100/100', tags: ['高意向'], reason: '历史高频互动，近期静默' },
              { id: 'c3', name: '赵总', avatar: 'https://picsum.photos/seed/c3/100/100', tags: ['高意向', '全款'], reason: '预算充足，关注学区' },
            ]
          },
          actionButtons: [{ label: '确认人群', action: 'confirm_audience', primary: true }]
        }));

        await sleep(1500);
        setShowProfile('c1');
        await sleep(3000);
        setShowProfile(null);
        await sleep(1000);

        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认人群");

        await aiMsg({
          content: '收到确认，正在撰写文案...',
          tasks: [
            { id: 't1', name: '圈选客户', status: 'done', progress: 100 },
            { id: 't2', name: '撰写文案', status: 'processing', progress: 60 },
            { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
          ]
        });

        await sleep(1500);
        await updateLastAiMsg(msg => ({
          ...msg,
          tasks: [
            { id: 't1', name: '圈选客户', status: 'done', progress: 100 },
            { id: 't2', name: '撰写文案', status: 'done', progress: 100 },
            { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
          ],
          copyCard: { type: '私聊召回文案', content: '陈先生您好！近期学区房政策有新利好，我们整理了一批高性价比的急售房源，特意发给您看看。周末有空来门店详细了解吗？' },
          actionButtons: [{ label: '确认文案', action: 'confirm_copy', primary: true }]
        }));

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认文案");

        await aiMsg({
          content: '请确认最终发送信息：',
          confirmCard: { title: '发送确认', count: 328, contentSnapshot: '陈先生您好！近期学区房政策有新利好...' },
          actionButtons: [{ label: '确认发送', action: 'confirm_send', primary: true }]
        });

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认发送");

        await aiMsg({
          content: '发送成功！已为您创建推送任务。',
          tasks: [
            { id: 't1', name: '圈选客户', status: 'done', progress: 100 },
            { id: 't2', name: '撰写文案', status: 'done', progress: 100 },
            { id: 't3', name: '私聊推送', status: 'done', progress: 100 },
          ],
          actionButtons: [{ label: '查看推送任务详情', action: 'goto_tasks' }]
        });

      } else if (scenarioId === 's2') {
        await type("给 @高意向人群包 发个私信，通知他们今天 LPR 降了 10 个点。");
        await userMsg("给 @高意向人群包 发个私信，通知他们今天 LPR 降了 10 个点。");

        await aiMsg({
          content: '正在处理您的请求：',
          tasks: [
            { id: 't1', name: '加载人群', status: 'done', progress: 100 },
            { id: 't2', name: '撰写金融文案', status: 'processing', progress: 50 },
          ]
        });

        await sleep(1500);
        await updateLastAiMsg(msg => ({
          ...msg,
          tasks: [
            { id: 't1', name: '加载人群', status: 'done', progress: 100 },
            { id: 't2', name: '撰写金融文案', status: 'done', progress: 100 },
          ],
          copyCard: { type: '金融政策私信', content: '【重磅利好】您好！今天央行宣布 LPR 下调 10 个基点，房贷利率创历史新低！现在是上车的绝佳时机，百万房贷月供可省数百元。需要帮您重新测算一下购房预算吗？' },
          actionButtons: [{ label: '确认文案', action: 'confirm_copy', primary: true }]
        }));

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认文案");

        await aiMsg({
          content: '文案已就绪。请问您希望使用哪些企微账号进行推送？您可以指定部门或具体负责人。'
        });

        await type("用‘苏南分部’所有置业顾问的账号。");
        await userMsg("用‘苏南分部’所有置业顾问的账号。");

        await aiMsg({
          content: '已为您匹配苏南分部共 15 个置业顾问账号。',
          confirmCard: { title: '推送确认', count: 1245, target: '苏南分部 (15个账号)', contentSnapshot: '【重磅利好】您好！今天央行宣布 LPR 下调...' },
          actionButtons: [{ label: '确认发送', action: 'confirm_send', primary: true }]
        });

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认发送");

        await aiMsg({
          content: '发送成功！已为您创建推送任务。'
        });

      } else if (scenarioId === 's3') {
        await type("针对‘学区房新政’，写一段话发朋友圈，再发到所有‘准业主群’。");
        await userMsg("针对‘学区房新政’，写一段话发朋友圈，再发到所有‘准业主群’。");

        await aiMsg({
          content: '已为您生成跨渠道分发文案，请确认：',
          copyCard: [
            { type: '朋友圈文案', content: '🚨学区房新政落地！\n📚名校划片范围调整，几家欢喜几家愁。\n🏠我们连夜整理了最新学区房捡漏清单，评论区扣“1”获取！👇' },
            { type: '群聊公告文案', content: '@所有人 各位准业主好，关于今天发布的学区房新政，我们已经整理了详细的解读报告和受影响楼盘清单。大家有任何疑问可以在群里随时@我！' }
          ],
          actionButtons: [{ label: '确认文案', action: 'confirm_copy', primary: true }]
        });

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认文案");

        await aiMsg({
          content: '请问朋友圈发布希望使用哪些账号？'
        });

        await type("用所有店长的账号发。");
        await userMsg("用所有店长的账号发。");

        await aiMsg({
          content: '已匹配 8 个店长账号。',
          confirmCard: { title: '朋友圈发布确认', count: 8, target: '所有店长账号', contentSnapshot: '🚨学区房新政落地！...' },
          actionButtons: [{ label: '确认执行', action: 'confirm_send', primary: true }]
        });

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认执行");

        await aiMsg({
          content: '朋友圈任务已创建。接下来，请问群发公告需要发送给哪些群？'
        });

        await type("发给带‘学区’标签的群。");
        await userMsg("发给带‘学区’标签的群。");

        await aiMsg({
          content: '已匹配到 12 个带有“学区”标签的群聊。',
          confirmCard: { title: '群发确认', count: 12, target: '带“学区”标签的群', contentSnapshot: '@所有人 各位准业主好，关于今天发布的...' },
          actionButtons: [{ label: '确认发送', action: 'confirm_send', primary: true }]
        });

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认发送");

        await aiMsg({
          content: '朋友圈任务与群发任务均已创建，您可以点击 [详情] 追踪各账号执行状态。',
          actionButtons: [{ label: '查看任务详情', action: 'goto_tasks' }]
        });

      } else if (scenarioId === 's4') {
        await type("圈出关注过‘三居室’但还没有成为线索的客户。");
        await userMsg("圈出关注过‘三居室’但还没有成为线索的客户。");

        await aiMsg({
          content: '正在执行人群圈选：',
          tasks: [
            { id: 't1', name: '圈选潜在客户', status: 'processing', progress: 40 }
          ]
        });

        await sleep(1500);
        await updateLastAiMsg(msg => ({
          ...msg,
          tasks: [
            { id: 't1', name: '圈选潜在客户', status: 'done', progress: 100 }
          ],
          audienceCard: {
            totalCount: 156,
            samples: [
              { id: 'c4', name: '张三', avatar: 'https://picsum.photos/seed/c4/100/100', tags: ['三居室', '无成交'], reason: '多次浏览三居室房源' },
              { id: 'c5', name: '李四', avatar: 'https://picsum.photos/seed/c5/100/100', tags: ['三居室'], reason: '收藏了多套三居室' },
            ]
          }
        }));

        await sleep(2000);
        setShowProfile('c4');
        await sleep(3500);
        setShowProfile(null);
        await sleep(1000);

        await type("排除掉所有有‘线下带看记录’的人，重新圈一下。");
        await userMsg("排除掉所有有‘线下带看记录’的人，重新圈一下。");

        await aiMsg({
          content: '正在重新执行圈选逻辑：',
          tasks: [
            { id: 't1', name: '圈选潜在客户 (修正)', status: 'processing', progress: 60 }
          ]
        });

        await sleep(1500);
        await updateLastAiMsg(msg => ({
          ...msg,
          tasks: [
            { id: 't1', name: '圈选潜在客户 (修正)', status: 'done', progress: 100 }
          ],
          audienceCard: {
            totalCount: 112,
            samples: [
              { id: 'c5', name: '李四', avatar: 'https://picsum.photos/seed/c5/100/100', tags: ['三居室'], reason: '收藏了多套三居室' },
              { id: 'c6', name: '王五', avatar: 'https://picsum.photos/seed/c6/100/100', tags: ['三居室', '纯线上'], reason: '仅在线上活跃' },
            ]
          },
          actionButtons: [{ label: '确认人群', action: 'confirm_audience', primary: true }]
        }));

        await sleep(2000);
        await updateLastAiMsg(msg => ({ ...msg, actionButtons: undefined }));
        await userMsg("确认人群");

        await aiMsg({
          content: '操作已完成，人群已保存。您可以点击 [人群详情] 查看完整名单。',
          actionButtons: [{ label: '查看人群详情', action: 'goto_audience' }]
        });
      }

    } catch (e: any) {
      if (e.message === 'STOPPED') {
        console.log('Demo stopped');
      }
    } finally {
      setDemoState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentScenario: null }));
      demoRef.current = { isPlaying: false, isPaused: false, isStopped: true };
    }
  };

  const handleSendMessage = (content: string) => {
    if (demoState.isPlaying) return;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // Mock Agent Logic
    setTimeout(() => {
      processAgentLogic(content);
    }, 1000);
  };

  const processAgentLogic = (content: string) => {
    setIsTyping(false);
    
    // Simple intent parsing
    if (content.includes('圈选') || content.includes('人群')) {
      // Create a task list
      const tasks: Task[] = [
        { id: 't1', name: '圈人群包', status: 'processing', progress: 50 },
        { id: 't2', name: '内容生成', status: 'pending', progress: 0 },
        { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
      ];
      
      const taskMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '正在为您执行任务流水线：',
        timestamp: new Date(),
        tasks,
      };
      setMessages(prev => [...prev, taskMsg]);

      // Simulate task completion and showing Audience Card
      setTimeout(() => {
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.tasks) {
            lastMsg.tasks[0].status = 'done';
            lastMsg.tasks[0].progress = 100;
          }
          return newMsgs;
        });

        const audienceMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '已为您圈选出目标人群，共计 1,245 人。请确认抽样结果：',
          timestamp: new Date(),
          audienceCard: {
            totalCount: 1245,
            samples: [
              { id: 'c1', name: '张女士', avatar: 'https://picsum.photos/seed/c1/100/100', tags: ['高意向', '近期活跃'], reason: '近3天咨询过三居室且未下单' },
              { id: 'c2', name: '李先生', avatar: 'https://picsum.photos/seed/c2/100/100', tags: ['沉睡唤醒'], reason: '历史成交客户，近期浏览过新盘' },
              { id: 'c3', name: '王女士', avatar: 'https://picsum.photos/seed/c3/100/100', tags: ['价格敏感'], reason: '多次对比周边竞品价格' },
            ]
          }
        };
        setMessages(prev => [...prev, audienceMsg]);
      }, 2000);

    } else if (content.includes('推送') && !content.includes('账号')) {
      // Mock missing parameter
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '由于未指定发送账号，请问您想用哪个企微账号执行私聊推送？',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } else {
      // Default response
      const defaultMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '已收到您的指令，正在为您处理...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, defaultMsg]);
    }
  };

  const handleAudienceConfirm = () => {
    if (demoState.isPlaying) return;
    const confirmMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '确认，继续后续任务',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const nextTaskMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '收到确认，正在为您生成营销内容...',
        timestamp: new Date(),
        tasks: [
          { id: 't1', name: '圈人群包', status: 'done', progress: 100 },
          { id: 't2', name: '内容生成', status: 'processing', progress: 30 },
          { id: 't3', name: '私聊推送', status: 'pending', progress: 0 },
        ]
      };
      setMessages(prev => [...prev, nextTaskMsg]);

      // Step 2: Finish content generation, start pushing
      setTimeout(() => {
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.tasks) {
            lastMsg.tasks[1].status = 'done';
            lastMsg.tasks[1].progress = 100;
            lastMsg.tasks[2].status = 'processing';
            lastMsg.tasks[2].progress = 20;
          }
          lastMsg.content = '内容生成完毕，正在执行私聊推送...';
          return newMsgs;
        });

        // Step 3: Finish pushing
        setTimeout(() => {
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.tasks) {
              lastMsg.tasks[2].status = 'done';
              lastMsg.tasks[2].progress = 100;
            }
            lastMsg.content = '所有任务已执行完毕！共计推送 1,245 人，预计 5 分钟内发送完成。您可以在【推送任务】中查看进度。';
            return newMsgs;
          });
        }, 2000);
      }, 2000);
    }, 1000);
  };

  const handleAudienceReject = () => {
    if (demoState.isPlaying) return;
    const rejectMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '不对，重新调整',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, rejectMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const adjustMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '好的，请告诉我需要如何调整圈选条件？例如：“排除已经购买过的客户”',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, adjustMsg]);
    }, 1000);
  };

  const handleActionClick = (action: string) => {
    if (action === 'goto_tasks') {
      onClose();
      navigate('/tasks');
    } else if (action === 'goto_audience') {
      onClose();
      navigate('/audience');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex flex-col shrink-0 z-30">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800 text-sm">365私域管家</h2>
                    <p className="text-xs text-slate-500">随时为您效劳</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    title="历史会话"
                  >
                    <History size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      stopDemo();
                      setMessages([{ id: '1', role: 'assistant', content: '您好！我是 365私域管家。', timestamp: new Date() }]);
                      setShowHistory(false);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="新建会话"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      stopDemo();
                      onClose();
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Demo Control Bar */}
              {demoState.isPlaying && (
                <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-700 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    自动演示中...
                  </span>
                  <div className="flex gap-2">
                    <button onClick={pauseDemo} className="p-1.5 bg-white text-indigo-600 rounded shadow-sm hover:bg-indigo-50">
                      {demoState.isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button onClick={stopDemo} className="p-1.5 bg-white text-red-600 rounded shadow-sm hover:bg-red-50">
                      <Square size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">历史会话</h3>
                <div className="space-y-2">
                  {[
                    { id: 'h1', title: '圈选高意向客户并推送', time: '2小时前', count: 12 },
                    { id: 'h2', title: '生成朋友圈文案', time: '昨天 15:30', count: 4 },
                    { id: 'h3', title: '群聊活动通知', time: '昨天 10:00', count: 8 },
                  ].map(item => (
                    <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all" onClick={() => setShowHistory(false)}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-slate-800">{item.title}</span>
                        <span className="text-xs text-slate-400">{item.time}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MessageSquare size={12} /> {item.count} 条对话
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Message List */}
                <MessageList 
                  messages={messages} 
                  isTyping={isTyping} 
                  onAudienceConfirm={handleAudienceConfirm}
                  onAudienceReject={handleAudienceReject}
                  onProfileClick={(id) => setShowProfile(id)}
                  onActionClick={handleActionClick}
                />

                {/* Scenarios List */}
                {messages.length === 1 && !demoState.isPlaying && (
                  <div className="absolute top-16 left-4 right-4 p-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm z-10 space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">功能演示场景</div>
                    {SCENARIOS.map(s => (
                      <div key={s.id} onClick={() => runDemo(s.id)} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.title}</span>
                          <Play size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <InputArea value={inputValue} onChange={setInputValue} onSend={handleSendMessage} disabled={demoState.isPlaying} />

                {/* Customer Profile Overlay */}
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="absolute inset-0 bg-white z-20 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <button onClick={() => setShowProfile(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                        <h3 className="font-semibold text-slate-800 text-sm">客户档案</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex flex-col items-center mb-6">
                          <img src={`https://picsum.photos/seed/${showProfile}/150/150`} className="w-20 h-20 rounded-full mb-3 border-4 border-white shadow-sm" referrerPolicy="no-referrer" />
                          <h2 className="text-lg font-bold text-slate-800">{showProfile === 'c1' ? '陈先生' : '张三'}</h2>
                          <p className="text-sm text-slate-500">南京</p>
                        </div>
                        <div className="mb-6">
                          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">客户标签</h4>
                          <div className="flex gap-2 flex-wrap">
                            {showProfile === 'c1' ? (
                              <><span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-md border border-blue-100">高意向</span><span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">近一个月没互动</span></>
                            ) : (
                              <><span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs rounded-md border border-orange-100">三居室</span><span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs rounded-md border border-purple-100">线下带看记录</span></>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">活跃轨迹</h4>
                          <div className="pl-4 border-l-2 border-slate-100 space-y-5">
                            {showProfile === 'c1' ? (
                              <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                                <p className="text-xs text-slate-500 mb-0.5">32天前</p>
                                <p className="text-sm text-slate-800">咨询了学区房相关政策</p>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                                <p className="text-xs text-slate-500 mb-0.5">昨天</p>
                                <p className="text-sm text-slate-800">由置业顾问带领线下看房（三居室）</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

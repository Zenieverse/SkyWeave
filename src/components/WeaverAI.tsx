/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Volume2, 
  Mic, 
  CloudLightning, 
  RefreshCw, 
  CheckCircle, 
  FileText, 
  Cpu, 
  Database,
  Layers,
  HeartPulse,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { NetworkStatus } from '../types';

interface WeaverAIProps {
  networkStatus: NetworkStatus;
  onAddTransaction: (desc: string, amount: number, type: 'earn' | 'spend' | 'transfer' | 'reward', isOffline: boolean) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'weaver';
  text: string;
  timestamp: string;
  agent?: 'connectivity' | 'education' | 'health' | 'commerce' | 'governance' | 'security' | 'intelligence';
  offlineQueued?: boolean;
}

export default function WeaverAI({ networkStatus, onAddTransaction }: WeaverAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'weaver',
      text: 'Greetings. I am Weaver AI, your local edge-synced intelligence node. Triage health parameters, calculate crop demand forecasts, manage solar mesh paths, or learn offline dialects. What resource do you require?',
      timestamp: '11:50',
      agent: 'intelligence'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<Message[]>([]);
  const [activeVoiceWave, setActiveVoiceWave] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, offlineQueue]);

  // When network status transitions from offline to online, flush queued items.
  useEffect(() => {
    if (networkStatus !== 'offline' && offlineQueue.length > 0) {
      const processQueue = async () => {
        // Transfer all queues to main screen with sync markings
        const flushed = offlineQueue.map(msg => ({
          ...msg,
          offlineQueued: false,
          text: `[RESTORED WORKSPACE CAPABILITY] ${msg.text}`
        }));

        setMessages(prev => [...prev, ...flushed]);
        
        // Add a beautiful Weaver automated answer
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `ans-sync-${Date.now()}`,
              sender: 'weaver',
              text: 'System Sync: Re-established satellite cloud channels! Re-calculating full telemetry with development banks, filing synchronized clinical metrics with WHO indicators, and authenticating biometric DPI registers safely.',
              timestamp: 'Now',
              agent: 'security'
            }
          ]);
        }, 1200);

        setOfflineQueue([]);
      };
      processQueue();
    }
  }, [networkStatus, offlineQueue]);

  const handleSend = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `usr-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: rawText,
      timestamp,
      offlineQueued: networkStatus === 'offline'
    };

    if (networkStatus === 'offline') {
      // Add to local offline queues
      setOfflineQueue(prev => [...prev, userMsg]);
      setInputText('');
      
      // Auto reply with off-line local knowledge block
      setTimeout(() => {
        const matchingAnswer = getLocalMockAnswer(rawText, true);
        setMessages(prev => [
          ...prev,
          userMsg,
          {
            id: `wev-${Date.now()}`,
            sender: 'weaver',
            text: `[OFFLINE CACHE COMPANION RESPONSE] ${matchingAnswer}\n\n⚠️ Note: This request is queued in localized storage and will sync to cloud registers once satellite or fiber link activates.`,
            timestamp,
            agent: identifyAgent(rawText)
          }
        ]);
      }, 800);
    } else {
      // Direct live mode
      setMessages(prev => [...prev, userMsg]);
      setInputText('');

      setTimeout(() => {
        const liveAnswer = getLocalMockAnswer(rawText, false);
        setMessages(prev => [
          ...prev,
          {
            id: `wev-${Date.now()}`,
            sender: 'weaver',
            text: liveAnswer,
            timestamp,
            agent: identifyAgent(rawText)
          }
        ]);
        
        // If they completed education tasks or help, reward them!
        if (rawText.toLowerCase().includes('quiz') || rawText.toLowerCase().includes('arithmetic')) {
          onAddTransaction('Weaver AI Interactive arithmetic bounty', 5, 'reward', false);
        }
      }, 1000);
    }
  };

  const getVoiceIndicatorWave = () => {
    setIsRecording(true);
    setActiveVoiceWave(true);
    setTimeout(() => {
      setIsRecording(false);
      setActiveVoiceWave(false);
      // Insert a localized sound prompt
      handleSend('Maternal healthcare nutrition warning signs');
    }, 3000);
  };

  const identifyAgent = (text: string): 'connectivity' | 'education' | 'health' | 'commerce' | 'governance' | 'security' | 'intelligence' => {
    const t = text.toLowerCase();
    if (t.includes('signal') || t.includes('battery') || t.includes('solar') || t.includes('mesh')) return 'connectivity';
    if (t.includes('learn') || t.includes('education') || t.includes('class') || t.includes('arithmetic')) return 'education';
    if (t.includes('health') || t.includes('clinic') || t.includes('maternal') || t.includes('doctor')) return 'health';
    if (t.includes('pricing') || t.includes('forecast') || t.includes('teff') || t.includes('coop')) return 'commerce';
    if (t.includes('vote') || t.includes('proposal') || t.includes('fund') || t.includes('credits')) return 'governance';
    if (t.includes('biometric') || t.includes('private') || t.includes('dpi') || t.includes('identity')) return 'security';
    return 'intelligence';
  };

  const getLocalMockAnswer = (query: string, offline: boolean): string => {
    const q = query.toLowerCase();
    
    // Connectivity
    if (q.includes('signal') || q.includes('battery') || q.includes('solar') || q.includes('mesh')) {
      return 'Connectivity Agent Report: Analyzed South Ridge and North Valley parameters. Signal degradation currently resolved via automated hops to Valley Center Satellite uplink. Solar battery mod is required for lowest peer nodes. Recommend running a Drone Synchronizer to sync physical content buffers to Dusk Valley.';
    }
    
    // Education
    if (q.includes('learn') || q.includes('education') || q.includes('class') || q.includes('arithmetic')) {
      return 'Education Agent Report: Generated adult literacy seed indices. Local households can run 10-minute micro-lessons offline. If child coordinates complete testing challenges, they earn 10 credits of localized transmission bandwidth bonus points.';
    }

    // Health
    if (q.includes('health') || q.includes('clinic') || q.includes('maternal') || q.includes('doctor')) {
      return 'Health Agent Report: Loaded maternal nutrition parameters. Critical guidance: Supplement diets with locally harvested high-yield teff grains and clean highlands honey. Avoid raw surface waters; run boiling treatments inside community basins configured on grid-node parameters.';
    }

    // Commerce
    if (q.includes('pricing') || q.includes('inventory') || q.includes('teff') || q.includes('honey')) {
      return 'Commerce Agent Report: Current localized demand forecast predicts a 15% pricing increase for wholesale Teff grain bags due to agricultural logistics bottlenecks. Encourage local cooperatives to hold back 5 units of grain reserves to satisfy village needs over the next cold cycle.';
    }

    // Identity / Security
    if (q.includes('biometric') || q.includes('identity') || q.includes('private') || q.includes('credentials')) {
      return 'Security Agent Report: Cryptographic W3C registration offline key generated successfully. Local peers can verify identities and secure commerce signatures peer-to-peer using short-range bluetooth, avoiding geostationary verification ping times.';
    }

    return 'Weaver Intelligence Agent: Understood. Checked local seed indexes and offline storage tables. Let me know if you would like me to trigger high-priority coordinates planning on your next mesh connection sync cycle.';
  };

  const getAgentLabel = (agent?: string) => {
    switch (agent) {
      case 'connectivity': return { label: 'Connectivity AI Agent', bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200' };
      case 'education': return { label: 'Education AI Agent', bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200' };
      case 'health': return { label: 'Health AI Agent', bg: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200' };
      case 'commerce': return { label: 'Commerce AI Agent', bg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200' };
      case 'governance': return { label: 'Governance AI Agent', bg: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200' };
      case 'security': return { label: 'Security AI Agent', bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-300' };
      default: return { label: 'Weaver Core Agent', bg: 'bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-white border-blue-200' };
    }
  };

  return (
    <div className="space-y-6" id="weaver-ai-module">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Multilingual options & voice dashboard */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              Weaver Voice & Local Agent Context
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Multi-agent design translating answers into local dialects fully offline.</p>
          </div>

          {/* Interactive Voice Panel */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-xl text-center space-y-4">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Voice-First Portal</span>
            
            <div className="flex items-center justify-center h-20">
              {activeVoiceWave ? (
                <div className="flex items-end gap-1 h-12">
                  {[4, 10, 6, 12, 5, 11, 4, 12, 7, 10, 4].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-purple-500 rounded-full animate-pulse" 
                      style={{ 
                        height: `${h * 4}px`, 
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.8s'
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <button 
                  onClick={getVoiceIndicatorWave}
                  className="p-5 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-full hover:scale-105 active:scale-95 transition-all shadow-inner relative flex items-center justify-center cursor-pointer"
                  id="btn-trigger-voice-mic"
                >
                  <Mic className="w-6 h-6 animate-pulse" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {isRecording ? 'Listening and capturing raw audio coordinates...' : 'Tap Mic to trigger offline voice dialogue search'}
            </p>
          </div>

          {/* Core instructions filters */}
          <div>
            <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block mb-2">Prompt Shortcuts</span>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Check South Forest battery status', prompt: 'Check South Forest clinic relay battery warnings' },
                { label: 'Maternal nutrition guidelines', prompt: 'Maternal healthcare nutrition guidelines' },
                { label: 'Teff crops pricing models', prompt: 'Pricing forecasts and demand for teff grain cooperatives' },
                { label: 'Verify my cryptographic biometric ID', prompt: 'How do I authenticate my biometric DPI credentials?' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="w-full text-left p-2 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 transition-all font-medium truncate shrink-0"
                  id={`btn-shortcut-${idx}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Console layout with scrollable messaging */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col justify-between min-h-[460px]">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-zinc-400" />
                Weaver AI Offline-First Console
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${networkStatus === 'offline' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-mono text-zinc-400">
                  {networkStatus === 'offline' ? 'OFFLINE (CACHE ACTIVE)' : 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Chat list */}
            <div className="h-80 overflow-y-auto space-y-4 pr-1">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                const tag = getAgentLabel(m.agent);

                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 border ${
                      isUser 
                        ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 text-white dark:text-zinc-950 rounded-br-none' 
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none'
                    }`}>
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-1 mb-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border leading-none font-semibold ${tag.bg}`}>
                            {tag.label}
                          </span>
                          <span className="text-[8px] text-zinc-400">{m.timestamp}</span>
                        </div>
                      )}
                      
                      <p className="text-xs font-medium leading-relaxed whitespace-pre-line">{m.text}</p>
                      
                      {isUser && m.offlineQueued && (
                        <div className="flex items-center gap-1 text-[8px] text-amber-300 mt-1 font-mono uppercase">
                          <CloudLightning className="w-2.5 h-2.5 animate-pulse" />
                          <span>Queued for Sync</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Prompt Send Bar */}
          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            {offlineQueue.length > 0 && (
              <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-400">
                <span className="flex items-center gap-1 font-mono">
                  <Database className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                  Offline Local Cache: <strong>{offlineQueue.length} files queued</strong>
                </span>
                <span className="text-[9px] font-bold">Auto-syncs upon satellite window...</span>
              </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text"
                placeholder={networkStatus === 'offline' ? 'Ask Weaver (offline-safe)...' : 'Type message to edge network agents...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="grow text-xs px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-500"
                id="input-prompt-chat"
              />
              <button 
                onClick={() => handleSend()}
                className="p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 hover:dark:bg-zinc-100 transition-all flex items-center justify-center cursor-pointer"
                id="btn-chat-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

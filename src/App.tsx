/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, 
  Plane, 
  Layers, 
  Cpu, 
  BookOpen, 
  HeartPulse, 
  Vote, 
  TrendingUp, 
  Smartphone, 
  Sliders, 
  Globe, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  Bell, 
  CheckCircle2, 
  HelpCircle,
  Database,
  ArrowRight
} from 'lucide-react';

import { 
  MeshNode, 
  Drone, 
  MarketSeed, 
  Course, 
  InventoryProduct, 
  LedgerEntry, 
  MicroLoanProposal, 
  CommunityProposal,
  UserType,
  NetworkStatus
} from './types';

import { 
  INITIAL_NODES, 
  INITIAL_DRONES, 
  MARKET_SEEDS, 
  COURSES, 
  MARKET_PRODUCTS, 
  LEDGER_HISTORY, 
  MICRO_LOANS, 
  COMMUNITY_PROPOSALS 
} from './mockData';

import NetworkHub from './components/NetworkHub';
import DroneSync from './components/DroneSync';
import SeedsMarketplace from './components/SeedsMarketplace';
import WeaverAI from './components/WeaverAI';
import EduTelehealth from './components/EduTelehealth';
import CommerceFintech from './components/CommerceFintech';
import GovernanceImpact from './components/GovernanceImpact';
import ZenInnovator from './components/ZenInnovator';

export default function App() {
  // Shared States Representing Local Grid Database
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_NODES);
  const [drones, setDrones] = useState<Drone[]>(INITIAL_DRONES);
  const [seeds, setSeeds] = useState<MarketSeed[]>(MARKET_SEEDS);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [products, setProducts] = useState<InventoryProduct[]>(MARKET_PRODUCTS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(LEDGER_HISTORY);
  const [loans, setLoans] = useState<MicroLoanProposal[]>(MICRO_LOANS);
  const [proposals, setProposals] = useState<CommunityProposal[]>(COMMUNITY_PROPOSALS);
  
  const [walletBalance, setWalletBalance] = useState<number>(142);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [activeUserType, setActiveUserType] = useState<UserType>('member');
  const [activeTab, setActiveTab] = useState<string>('mesh');

  // Interactive Live Platform Banner Alerts Queue
  const [notifications, setNotifications] = useState<string[]>([
    'System initialization: Decentralized mesh database connected.',
    'Weather Advisory: Skies clear outside Highlands region, autonomous flight-ready.'
  ]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 4)]);
  };

  // State modification Handlers (shared reactively across submodules)
  const handleAddNode = (newNode: MeshNode) => {
    setNodes(prev => [...prev, newNode]);
    addNotification(`Mesh Registry: Provisioned and synchronized relay "${newNode.name}".`);
  };

  const handleOptimizeNodes = () => {
    setNodes(prev => prev.map(n => ({
      ...n,
      status: n.status === 'offline' ? 'offline' : 'online',
      battery: Math.min(100, n.battery + 10),
      signal: Math.min(100, n.signal + 12),
      bandwidth: Math.min(150, n.bandwidth + 15)
    })));
    addNotification('Connectivity Agent: Executed multi-hop path signal optimization calculations.');
  };

  const handleSyncComplete = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          status: 'online',
          battery: 100,
          signal: 95,
          activeUsers: Math.floor(Math.random() * 20) + 15,
          bandwidth: 60,
          lastSync: 'Sync completed via Drone swarm'
        };
      }
      return n;
    }));
    addNotification('Drone Sync Swarm: Landed at destination. Downloaded and resolved pending records.');
  };

  const handleUpdateDroneBattery = (droneId: string, nextBattery: number) => {
    setDrones(prev => prev.map(d => d.id === droneId ? { ...d, battery: nextBattery } : d));
  };

  const handleDownloadSeed = (seedId: string) => {
    setSeeds(prev => prev.map(s => s.id === seedId ? { ...s, isDownloaded: true, downloads: s.downloads + 1 } : s));
    addNotification('Seeds Marketplace: Content seeds downloaded successfully to target local node database.');
  };

  const handleUploadSeed = (newSeed: MarketSeed) => {
    setSeeds(prev => [...prev, newSeed]);
    addNotification(`Seeds Marketplace: Registered and compiled infrastructure seed "${newSeed.title}".`);
  };

  const handleBroadcastSeed = (seedId: string) => {
    setSeeds(prev => prev.map(s => s.id === seedId ? { ...s, downloads: s.downloads + 1 } : s));
    addNotification('Bluetooth broadcast triggered: Transmitting seed packet peer-to-peer.');
  };

  const handleCompleteCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, completed: true } : c));
    addNotification('Education Academy: Congratulations! Issued digital micro-certificate of completion.');
  };

  const handlePurchaseProduct = (productId: string, price: number) => {
    setWalletBalance(prev => prev - price);
    addNotification(`Local Trade System: Vouchers allocated. Deducted ${price} credits.`);
  };

  const handleAddTransaction = (desc: string, amount: number, type: 'earn' | 'spend' | 'transfer' | 'reward', isOffline: boolean) => {
    const nextTx: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      amount,
      description: desc,
      isOffline
    };

    setLedger(prev => [nextTx, ...prev]);
    setWalletBalance(prev => prev + amount);
    addNotification(`SkyPay Ledger: ${amount > 0 ? '+' : ''}${amount} Credits transaction matched.`);
  };

  const handleUpdateLoanFunding = (loanId: string, amountAdded: number) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        const nextFunded = l.funded + amountAdded;
        return {
          ...l,
          funded: nextFunded,
          status: nextFunded >= l.amount ? 'active' : 'funding'
        };
      }
      return l;
    }));
    addNotification(`Microfinance Circle: Backed loan block with ${amountAdded} credit tokens.`);
  };

  const handleAddProposal = (newProp: CommunityProposal) => {
    setProposals(prev => [...prev, newProp]);
    addNotification(`Consensus DAO: Filed community ballot "${newProp.title}".`);
  };

  const handleVoteProposal = (proposalId: string, voteType: 'yes' | 'no') => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesYes: voteType === 'yes' ? p.votesYes + 1 : p.votesYes,
          votesNo: voteType === 'no' ? p.votesNo + 1 : p.votesNo
        };
      }
      return p;
    }));
    addNotification(`Consensus DAO: Cryptographic voting key submitted for Ballot #${proposalId.slice(-4).toUpperCase()}.`);
  };

  // Helper dictionary guiding roles perspective layouts
  const getUserTypeGuide = (role: UserType) => {
    switch (role) {
      case 'host': return { label: 'Community Host', desc: 'Manage solar power grids, extend signal ranges, and claim hosting dividend passive balances.', theme: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/20 text-yellow-600' };
      case 'educator': return { label: 'Local Educator', desc: 'Deploy adult literacy seeds, manage offline learning courses, and award classroom credit certificates.', theme: 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 text-emerald-600' };
      case 'healthcare': return { label: 'Health Worker', desc: 'Triage child risk symptoms, record vaccinations offline, and prioritize Drone Sync medical requests.', theme: 'border-rose-300 dark:border-rose-700 bg-rose-50/20 text-rose-600' };
      case 'ngo': return { label: 'NGO Project Lead', desc: 'Deploy mesh relays worldwide, coordinate geostationary backhauls, and generate data audit reports.', theme: 'border-blue-300 dark:border-blue-700 bg-blue-50/20 text-blue-600' };
      case 'gov': return { label: 'Government Operator', desc: 'Deploy regional funding initiatives and analyze sustainable regional equity growth meters.', theme: 'border-purple-300 dark:border-purple-700 bg-purple-50/20 text-purple-600' };
      case 'telecom': return { label: 'Telecom Partner', desc: 'Expand coverage parameters, integrate core cellular servers, and participate in revenue sharing plans.', theme: 'border-cyan-300 dark:border-cyan-700 bg-cyan-50/20 text-cyan-600' };
      default: return { label: 'Community Member', desc: 'Access decentralized educational courses, buy products offline, and chat with local Weaver AI.', theme: 'border-zinc-350 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white' };
    }
  };

  const guide = getUserTypeGuide(activeUserType);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/10 selection:text-indigo-500 flex flex-col justify-between" id="app-root-frame">
      
      {/* Top Navigation banner header */}
      <header className="sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl flex items-center justify-center shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight font-sans">SkyWeave Platform</h1>
              <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400">Decentralized Global Connectivity</p>
            </div>
          </div>

          {/* Interactive Global Role / User Type selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <UserCheck className="w-4 h-4" />
              <span>Active Role:</span>
            </div>
            <select
              value={activeUserType}
              onChange={(e) => {
                setActiveUserType(e.target.value as UserType);
                addNotification(`App Persona changed: Swapped to active ${e.target.value.toUpperCase()} perspective.`);
              }}
              className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg focus:outline-hidden cursor-pointer"
              id="select-user-role-global"
            >
              <option value="member">👤 Community Member</option>
              <option value="host">🛰️ Community Host</option>
              <option value="educator">🏫 Educator</option>
              <option value="healthcare">🩺 Healthcare Worker</option>
              <option value="ngo">🌍 NGO Administrator</option>
              <option value="gov">🏛️ Government Operator</option>
              <option value="telecom">📞 Telecom Partner</option>
            </select>
            
            {/* Global synchronized network trigger display status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-810 rounded-lg text-xs font-mono">
              {networkStatus === 'offline' ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  <span className="text-amber-500 font-bold">OFFLINE BUFFER</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-zinc-500">GRID SYNCED</span>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main interactive grid contents */}
      <main className="max-w-7xl mx-auto px-6 py-6 grow w-full space-y-6">
        
        {/* Dynamic Header Grid: Role guidance & Zen - Innovator card on the front */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <div className={`p-5 rounded-2xl border h-full flex flex-col justify-between gap-4 text-xs ${guide.theme} transition-all duration-300`}>
              <div>
                <p className="font-bold flex items-center gap-1.5 text-xs mb-1 uppercase tracking-wider">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                  Viewing perspective: {guide.label}
                </p>
                <p className="opacity-90 leading-relaxed text-zinc-700 dark:text-zinc-350">{guide.desc}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-current/15 text-[10px] font-mono select-none">
                <span className="font-bold uppercase tracking-widest opacity-80">
                  Universal Network Access 
                </span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-950/5 dark:bg-white/10 font-bold">
                  SECURE CHANNELS ACTIVE
                </span>
              </div>
            </div>
          </div>
          
          {/* Zen - Innovator Showcase with Drag-and-Drop Image Uploader */}
          <ZenInnovator />
        </div>

        {/* Tab Selection Menu */}
        <div className="flex flex-wrap border-b border-zinc-200 dark:border-zinc-800 gap-1">
          {[
            { id: 'mesh', label: 'SkyMesh Topology', idx: '1', icon: <Radio className="w-4 h-4" /> },
            { id: 'drones', label: 'Drone Sync Swap', idx: '2', icon: <Plane className="w-4 h-4" /> },
            { id: 'seeds', label: 'Seeds P2P Market', idx: '3', icon: <Layers className="w-4 h-4" /> },
            { id: 'weaver', label: 'Weaver AI Companion', idx: '4', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
            { id: 'eduhealth', label: 'Community Ed & Health', idx: '5', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'commerce', label: 'SkyPay Wallet & Stores', idx: '6', icon: <Smartphone className="w-4 h-4" /> },
            { id: 'gov', label: 'DAO Governance & Impact', idx: '7', icon: <Vote className="w-4 h-4" /> }
          ].map(tb => (
            <button
              key={tb.id}
              onClick={() => {
                setActiveTab(tb.id);
                addNotification(`Tab Changed: Opened ${tb.label}.`);
              }}
              className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tb.id 
                  ? 'border-indigo-650 text-indigo-700 dark:border-white dark:text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-850 dark:text-zinc-450 dark:hover:text-zinc-200'
              }`}
              id={`tab-btn-${tb.id}`}
            >
              {tb.icon}
              <span>{tb.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab View Mounting */}
        <div className="min-h-[460px] relative">
          {activeTab === 'mesh' && (
            <NetworkHub 
              nodes={nodes}
              onAddNode={handleAddNode}
              onOptimizeNodes={handleOptimizeNodes}
              networkStatus={networkStatus}
              setNetworkStatus={setNetworkStatus}
            />
          )}

          {activeTab === 'drones' && (
            <DroneSync 
              drones={drones}
              nodes={nodes}
              onSyncComplete={handleSyncComplete}
              onUpdateDroneBattery={handleUpdateDroneBattery}
            />
          )}

          {activeTab === 'seeds' && (
            <SeedsMarketplace 
              seeds={seeds}
              onDownloadSeed={handleDownloadSeed}
              onUploadSeed={handleUploadSeed}
              onBroadcastSeed={handleBroadcastSeed}
            />
          )}

          {activeTab === 'weaver' && (
            <WeaverAI 
              networkStatus={networkStatus}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'eduhealth' && (
            <EduTelehealth 
              courses={courses}
              onCompleteCourse={handleCompleteCourse}
              onAddTransaction={handleAddTransaction}
              networkStatus={networkStatus}
            />
          )}

          {activeTab === 'commerce' && (
            <CommerceFintech 
              products={products}
              ledger={ledger}
              loans={loans}
              onPurchaseProduct={handlePurchaseProduct}
              onAddTransaction={handleAddTransaction}
              onUpdateLoanFunding={handleUpdateLoanFunding}
              walletBalance={walletBalance}
              networkStatus={networkStatus}
            />
          )}

          {activeTab === 'gov' && (
            <GovernanceImpact 
              proposals={proposals}
              onVoteProposal={handleVoteProposal}
              onAddProposal={handleAddProposal}
              networkStatus={networkStatus}
            />
          )}
        </div>

      </main>

      {/* Footer notifications, developer logs & compliance credits */}
      <footer className="border-t border-zinc-200 dark:border-zinc-805 bg-white dark:bg-zinc-950 px-6 py-5 mt-12 z-10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          
          <div className="space-y-2 md:max-w-md">
            <span className="text-[10px] font-bold font-mono text-zinc-450 uppercase tracking-widest block">Live Regional Telemetry Console</span>
            <div className="h-16 overflow-y-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-2 rounded-lg font-mono text-[9px] text-zinc-500 space-y-1">
              {notifications.map((msg, index) => (
                <p key={index} className="truncate">✔ {msg}</p>
              ))}
            </div>
          </div>

          <div className="text-zinc-400 space-y-1.5 md:text-right font-mono text-[10px]">
            <p>Framework Version Compliances: W3C Decentralized Identifiers • UNICEF Digital Goods Standards</p>
            <p>SkyWeave Global Systems Operations, Limited © 2026. Connecting the next 2.9 Billion people.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}

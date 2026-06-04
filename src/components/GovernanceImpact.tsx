/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Vote, 
  BookOpen, 
  TrendingUp, 
  LineChart, 
  Download, 
  Plus, 
  MessageSquare, 
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Globe,
  DollarSign,
  HeartPulse
} from 'lucide-react';
import { CommunityProposal } from '../types';

interface GovernanceImpactProps {
  proposals: CommunityProposal[];
  onVoteProposal: (proposalId: string, voteType: 'yes' | 'no') => void;
  onAddProposal: (proposal: CommunityProposal) => void;
  networkStatus: string;
}

export default function GovernanceImpact({ 
  proposals, 
  onVoteProposal, 
  onAddProposal,
  networkStatus 
}: GovernanceImpactProps) {
  const [activeSubTab, setActiveSubTab] = useState<'governance' | 'impact'>('governance');
  
  // Custom Proposal publisher state
  const [showPropForm, setShowPropForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'mesh' | 'funding' | 'health' | 'education'>('mesh');

  // Voting feedback states
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const prop: CommunityProposal = {
      id: `prop-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      proposer: 'Cooperative Member (Me)',
      category: newCategory,
      votesYes: 1,
      votesNo: 0,
      status: 'voting',
      deadlineDays: 7
    };

    onAddProposal(prop);
    setNewTitle('');
    setNewDesc('');
    setShowPropForm(false);
  };

  const handleVote = (propId: string, choice: 'yes' | 'no') => {
    if (votedMap[propId]) return; // Single vote check
    onVoteProposal(propId, choice);
    setVotedMap(prev => ({ ...prev, [propId]: true }));
  };

  return (
    <div className="space-y-6" id="governance-impact-module">
      
      {/* Dynamic Sub Tabs */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setActiveSubTab('governance')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'governance' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-gov"
        >
          DAO Community Governance Systems
        </button>
        <button
          onClick={() => setActiveSubTab('impact')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'impact' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-imp"
        >
          Impact Intelligence Analytics
        </button>
      </div>

      {activeSubTab === 'governance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="gov-view">
          
          {/* Active proposals list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-zinc-500" />
                  Active Cooperative Ballots
                </h3>
                <p className="text-[11px] text-zinc-400">Cast cryptographic yes/no tokens to allocate communal infrastructure credits.</p>
              </div>
              <button
                onClick={() => setShowPropForm(!showPropForm)}
                className="text-xs font-semibold px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-lg"
                id="btn-trigger-proposal-form"
              >
                Draft Proposal
              </button>
            </div>

            {showPropForm && (
              <form onSubmit={handleCreateProposal} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md space-y-4 font-sans" id="form-create-ballot">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Formulate Public Infrastructure Ballot</h4>

                <div>
                  <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Ballot Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Expand coverage to West Agricultural border"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="input-proposal-title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Resource allocation Category</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="mesh">Mesh Hardware & Batteries</option>
                      <option value="funding">Micro-Savings credit allocations</option>
                      <option value="health">Clinics & Telehealth Supplies</option>
                      <option value="education">Literacy classes & digital bounties</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Ballot Description</label>
                  <textarea 
                    required 
                    rows={2}
                    placeholder="Detail resource costs, timeline, and physical goals..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="textarea-proposal-desc"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button 
                    type="button" 
                    onClick={() => setShowPropForm(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    id="btn-submit-proposal"
                  >
                    File Public Ballot
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {proposals.map(prop => {
                const totalVotes = prop.votesYes + prop.votesNo;
                const yesPercent = totalVotes > 0 ? Math.round((prop.votesYes / totalVotes) * 100) : 0;
                
                return (
                  <div key={prop.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{prop.category} RESOURCE BALLOT</span>
                        <h4 className="text-sm font-semibold text-zinc-950 dark:text-white mt-0.5">{prop.title}</h4>
                      </div>
                      <span className={`text-[8px] font-mono px-2.5 py-1 rounded-sm ${
                        prop.status === 'passed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950' : 'bg-indigo-50 text-indigo-700 dark:bg-zinc-800 dark:text-white'
                      }`}>
                        {prop.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{prop.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>Consensus Ratio: {yesPercent}% YES ({prop.votesYes} yes, {prop.votesNo} no)</span>
                        <span className="font-mono">Total votes: {totalVotes}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${yesPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-2">
                      <span className="text-[10px] text-zinc-400 italic">Authored by {prop.proposer}</span>

                      {prop.status === 'voting' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVote(prop.id, 'yes')}
                            disabled={votedMap[prop.id]}
                            className={`p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:border-emerald-500 transition-colors flex items-center gap-1.5 text-[10px] font-bold ${
                              votedMap[prop.id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            id={`btn-vote-yes-${prop.id}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                            YES
                          </button>
                          <button
                            onClick={() => handleVote(prop.id, 'no')}
                            disabled={votedMap[prop.id]}
                            className={`p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:border-rose-500 transition-colors flex items-center gap-1.5 text-[10px] font-bold ${
                              votedMap[prop.id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            id={`btn-vote-no-${prop.id}`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                            NO
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAO overview specs */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-fit space-y-4">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Consensus Governance Framework</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Decentralized consensus operates offline using short-range Bluetooth signatures. When community members sync via data drones or geostationary satellite windows, cumulative tallies are integrated into the main regional registry.
            </p>

            <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-indigo-500 font-bold block">Consensus Audit Checklist</span>
              <ul className="space-y-1.5 text-[11px] text-zinc-650 dark:text-zinc-400">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> W3C DID signatures authenticated</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Low-Precipitation weather valid</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Minimum 40% peer voter turn-out</li>
              </ul>
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-6" id="impact-intelligence-analytics">
          
          {/* Top key indicators overview row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Internet Digital Equity Gap', val: '+214%', desc: 'Rural village coverage offset', icon: <Globe className="w-5 h-5 text-indigo-500" /> },
              { label: 'CO2 Clean Energy offset', val: '412 kg', desc: 'Solar battery reduction index', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
              { label: 'Child Literacy Improvement', val: '+42%', desc: 'Via localized education seeds', icon: <BookOpen className="w-5 h-5 text-purple-500" /> },
              { label: 'Clinics Triage synchronized', val: '1,450', desc: 'Symptom questionnaires filed', icon: <HeartPulse className="w-5 h-5 text-rose-500" /> }
            ].map((stat, idx) => (
              <div key={idx} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">{stat.label}</span>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold font-sans text-zinc-900 dark:text-white block">{stat.val}</span>
                <p className="text-[10px] text-zinc-400 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Graphical custom visual dashboard charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Sustainable Regional growth Tracker</h3>
                <p className="text-[11px] text-zinc-400">Total active households using solar mesh relays (12-month indicators)</p>
              </div>

              {/* High precision CSS bar visual representation chart */}
              <div className="space-y-3 pt-2">
                {[
                  { month: 'June (Current Target)', value: 140, barW: '100%', count: '140 households' },
                  { month: 'May (Pass-sync)', value: 110, barW: '78%', count: '110 households' },
                  { month: 'Apr (Mesh Relay Launch)', value: 85, barW: '60%', count: '85 households' },
                  { month: 'Mar (Pilot deployment)', value: 30, barW: '21%', count: '30 households' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.3 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-semibold text-zinc-905">{item.month}</span>
                      <span className="text-zinc-400 font-bold">{item.count}</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-950 rounded-sm overflow-hidden flex items-center pr-2">
                      <div 
                        className="h-full bg-indigo-500 rounded-sm" 
                        style={{ width: item.barW }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Intelligence reporting cards */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-5">
              <div>
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block">UNICEF & WHO Compliance</span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">Export Regional Audit Logs</h3>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Compiles data logs matching UNICEF Digital Public Goods Standards and W3C decentralized identity registers, safe for development banks and international aid operators.
              </p>

              <button 
                onClick={() => alert('Compiling SkyWeave regional compliance analytics report... Exported secure checksum bundle.')}
                className="w-full text-xs font-semibold py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                id="btn-export-reports"
              >
                <Download className="w-4 h-4" />
                Export PDF Audit Log Checksums
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

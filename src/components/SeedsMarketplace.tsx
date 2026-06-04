/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  CheckCircle, 
  BookOpen, 
  HeartPulse, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Plus, 
  Search, 
  Tv 
} from 'lucide-react';
import { MarketSeed } from '../types';

interface SeedsMarketplaceProps {
  seeds: MarketSeed[];
  onDownloadSeed: (seedId: string) => void;
  onUploadSeed: (seed: MarketSeed) => void;
  onBroadcastSeed: (seedId: string) => void;
}

export default function SeedsMarketplace({ seeds, onDownloadSeed, onUploadSeed, onBroadcastSeed }: SeedsMarketplaceProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom seed publishing states
  const [showPublisher, setShowPublisher] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'education' | 'healthcare' | 'commerce' | 'government' | 'ai'>('education');
  const [newSize, setNewSize] = useState<string>('12.5 MB');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newContents, setNewContents] = useState<string>('');

  const handlePublishSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const generatedSeed: MarketSeed = {
      id: `seed-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      size: newSize,
      downloads: 1,
      isDownloaded: true,
      rating: 5.0,
      description: newDesc,
      contents: newContents ? newContents.split(',').map(s => s.trim()) : ['Offline general indices and guides.']
    };

    onUploadSeed(generatedSeed);
    setNewTitle('');
    setNewDesc('');
    setNewContents('');
    setShowPublisher(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'healthcare': return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'commerce': return <ShoppingBag className="w-4 h-4 text-amber-500" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-purple-500" />;
      default: return <Layers className="w-4 h-4 text-indigo-500" />;
    }
  };

  const filteredSeeds = seeds.filter(seed => {
    const matchesCategory = filterCategory === 'all' || seed.category === filterCategory;
    const matchesSearch = seed.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          seed.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6" id="seeds-marketplace-module">
      
      {/* Search and Categories bar layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-indigo-500 animate-pulse" />
            Decentralized Internet Seeds Marketplace
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            P2P downloadable compressed data capsules. Once downloaded locally to your node, share them instantly over local mesh to peer networks without any satellite connectivity.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPublisher(!showPublisher)}
            className="text-xs font-semibold px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            id="btn-show-seed-publisher"
          >
            <Plus className="w-4 h-4" />
            Publish Seed Packet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation / category filters */}
        <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-fit space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search offline seeds..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-indigo-500"
              id="input-search-seeds"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block mb-2">Filters</span>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Seeds Capsule Deck' },
                { id: 'education', label: 'Educational Materials' },
                { id: 'healthcare', label: 'Health Clinics & Guides' },
                { id: 'commerce', label: 'Local Store Trade Catalogs' },
                { id: 'ai', label: 'Offline Weaver AI Models' },
                { id: 'government', label: 'DPI Public Registers' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`w-full text-xs text-left px-3 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === cat.id 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                  id={`filter-cat-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic seeds display and publisher panels */}
        <div className="lg:col-span-3 space-y-6">
          {showPublisher && (
            <form onSubmit={handlePublishSeed} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md space-y-4" id="form-publish-seed">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">
                Compile & Register New Infrastructure Seed
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Seed Pack Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Pediatric Sanitation Tutorial Manual"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="input-seed-title"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Functional Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="select-seed-category"
                  >
                    <option value="education">Education Ecosystem Pack</option>
                    <option value="healthcare">Healthcare & Patient Clinics</option>
                    <option value="commerce">Commerce Catalogs & Pricing boards</option>
                    <option value="ai">Offline Weaver Training Weight</option>
                    <option value="government">DPI Digital Identity Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Detailed Capsule Description</label>
                <textarea 
                  required 
                  rows={2}
                  placeholder="Provide precise guidelines. Keep it compressed for fast mesh transmission sizes."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="textarea-seed-desc"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Enclosed Files & Assets (Comma separated list)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Flashcards.pak, VoiceSynthesisRules.bin, ChildProfilesTemplate.json"
                  value={newContents}
                  onChange={(e) => setNewContents(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="input-seed-files"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <button 
                  type="button" 
                  onClick={() => setShowPublisher(false)}
                  className="text-xs font-semibold px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 hover:dark:bg-zinc-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="text-xs font-semibold px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors"
                  id="btn-confirm-publish-seed"
                >
                  Confirm & Broadcast Seed
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSeeds.map((seed) => (
              <div 
                key={seed.id} 
                className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between shadow-xs relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] bg-zinc-50 dark:bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-100 dark:border-zinc-800 uppercase tracking-wide font-mono">
                      {getCategoryIcon(seed.category)}
                      <span className="ml-1 text-zinc-600 dark:text-zinc-300 font-semibold">{seed.category}</span>
                    </span>
                    <span className="text-[10px] font-mono font-medium text-zinc-400">{seed.size}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight font-sans">
                      {seed.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 lines-clamp-2">
                      {seed.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">Index Packages Included</span>
                    <ul className="space-y-0.5 text-[10px] text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                      {seed.contents.slice(0, 3).map((item, index) => (
                        <li key={`index-${index}`} className="truncate">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-4 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-zinc-400">
                    Shared P2P: <strong className="text-zinc-800 dark:text-zinc-200">{seed.downloads} matches</strong>
                  </span>

                  <div className="flex gap-1.5">
                    {seed.isDownloaded ? (
                      <>
                        <button
                          onClick={() => onBroadcastSeed(seed.id)}
                          className="p-2 border border-blue-200 bg-blue-50/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                          title="Broadcast Capsule peer-to-peer"
                          id={`btn-broadcast-${seed.id}`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>P2P Broadcast</span>
                        </button>
                        <span className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-1 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Ready Offline</span>
                        </span>
                      </>
                    ) : (
                      <button 
                        onClick={() => onDownloadSeed(seed.id)}
                        className="p-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                        id={`btn-download-${seed.id}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download offline</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

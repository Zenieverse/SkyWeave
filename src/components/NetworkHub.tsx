/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Battery, 
  Cpu, 
  Map, 
  Plus, 
  CheckCircle, 
  Sliders, 
  RefreshCw, 
  Signal, 
  Eye, 
  AlertTriangle,
  Camera,
  QrCode,
  Check,
  X
} from 'lucide-react';
import { MeshNode } from '../types';

interface NetworkHubProps {
  nodes: MeshNode[];
  onAddNode: (node: MeshNode) => void;
  onOptimizeNodes: () => void;
  networkStatus: string;
  setNetworkStatus: (status: 'online' | 'satellite' | 'mesh' | 'offline') => void;
}

export default function NetworkHub({ 
  nodes, 
  onAddNode, 
  onOptimizeNodes, 
  networkStatus, 
  setNetworkStatus 
}: NetworkHubProps) {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(nodes[0] || null);
  const [optMessage, setOptMessage] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  
  // Form state for adding node
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'solar' | 'satellite_uplink' | 'drone_repeater' | 'community_server'>('solar');
  const [newBattery, setNewBattery] = useState(100);
  const [newSignal, setNewSignal] = useState(85);

  // QR Code Scanner State variables
  const [addMode, setAddMode] = useState<'qr' | 'manual'>('qr');
  const [qrScanning, setQrScanning] = useState(false);
  const [qrMessage, setQrMessage] = useState('');
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera on unmount or mode toggle
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Webcam stream is unsupported in this browser environment. Using holographic simulation scan.");
      }
    } catch (err: any) {
      console.warn("Camera streaming failed", err);
      setCameraError("Camera permission blocked or device unavailable. Running with active network simulator scanning.");
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handlePresetScan = (presetName: string, presetType: 'solar' | 'community_server' | 'drone_repeater' | 'satellite_uplink', defaultBattery: number, defaultSignal: number, defaultBandwidth: number) => {
    setQrScanning(true);
    setScannedResult(null);
    setQrMessage("Decrypting node key certificate signatures...");
    
    setTimeout(() => {
      setQrMessage("Validating decentralized spectrum protocol metadata...");
      setTimeout(() => {
        setQrScanning(false);
        setQrMessage("");
        setScannedResult({
          id: `qr-node-${Math.floor(1000 + Math.random() * 9000)}`,
          name: presetName,
          type: presetType,
          battery: defaultBattery,
          signal: defaultSignal,
          bandwidth: defaultBandwidth,
          activeUsers: 0
        });
      }, 900);
    }, 700);
  };

  const handleRegisterScannedNode = () => {
    if (!scannedResult) return;
    
    const newNode: MeshNode = {
      id: scannedResult.id,
      name: scannedResult.name,
      status: 'online',
      type: scannedResult.type,
      battery: scannedResult.battery,
      signal: scannedResult.signal,
      activeUsers: scannedResult.activeUsers,
      bandwidth: scannedResult.bandwidth,
      locX: Math.floor(Math.random() * 50) + 25,
      locY: Math.floor(Math.random() * 50) + 25,
      lastSync: 'Scanned Node Connected'
    };

    onAddNode(newNode);
    setSelectedNode(newNode);
    setScannedResult(null);
    setShowAddForm(false);
    handleStopCamera();
  };

  // Mock File Decryptor
  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrScanning(true);
      setScannedResult(null);
      setQrMessage(`Decoding QR raw image file: ${file.name}...`);
      
      setTimeout(() => {
        setQrScanning(false);
        setQrMessage("");
        setScannedResult({
          id: `qr-file-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `${file.name.split('.')[0]} Relay`,
          type: 'solar',
          battery: 95,
          signal: 90,
          bandwidth: 35,
          activeUsers: 0
        });
      }, 1200);
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    const newNode: MeshNode = {
      id: `node-${Date.now()}`,
      name: newName,
      status: 'online',
      type: newType,
      battery: Number(newBattery),
      signal: Number(newSignal),
      activeUsers: 0,
      bandwidth: newType === 'satellite_uplink' ? 100 : newType === 'community_server' ? 40 : 25,
      locX: Math.floor(Math.random() * 60) + 20, // keep within center range
      locY: Math.floor(Math.random() * 60) + 20,
      lastSync: 'Now'
    };

    onAddNode(newNode);
    setSelectedNode(newNode);
    setNewName('');
    setShowAddForm(false);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptMessage('Connectivity Agent running latency diagnostic checks...');
    setTimeout(() => {
      setOptMessage('Calculating optimal multi-hop paths to conserve battery levels...');
      setTimeout(() => {
        onOptimizeNodes();
        setOptMessage('AI mesh optimization completed successfully! Auto-failover paths configured to Dusk Valley.');
        setIsOptimizing(false);
        // Clear message after high-visibility period
        setTimeout(() => setOptMessage(''), 4000);
      }, 1500);
    }, 1200);
  };

  // Stats calculation
  const totalUsers = nodes.reduce((sum, n) => sum + (n.status !== 'offline' ? n.activeUsers : 0), 0);
  const onlineCount = nodes.filter(n => n.status === 'online').length;
  const avgBattery = Math.round(nodes.reduce((sum, n) => sum + n.battery, 0) / nodes.length);

  return (
    <div className="space-y-6" id="network-hub-module">
      {/* Network Mode Controller & Stats Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-500 animate-pulse" />
              Decentralized Transmission Mode
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mb-4">
              Select key connection levels of the mesh environment. The platform adapts AI services and transaction cache registers dynamically to current topology states.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'online', label: 'Fiber Backhaul', desc: 'Direct fast link', color: 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/30' },
              { id: 'satellite', label: 'Satellite', desc: 'Geostationary backup', color: 'text-sky-500 bg-sky-50 border-sky-200 dark:bg-sky-950/20 dark:border-sky-800/30' },
              { id: 'mesh', label: 'Local Mesh', desc: 'Device-to-Device path Only', color: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40' },
              { id: 'offline', label: 'Offline Sync Mode', desc: 'Saves transactions in queue', color: 'text-zinc-500 bg-zinc-50 border-zinc-200 dark:bg-zinc-800/20 dark:border-zinc-700/30' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setNetworkStatus(m.id as any)}
                className={`p-3 relative rounded-xl border text-left transition-all ${
                  networkStatus === m.id 
                    ? `border-zinc-900 dark:border-white ring-2 ring-zinc-900/10 dark:ring-white/10 bg-zinc-50 dark:bg-zinc-800` 
                    : 'border-zinc-100 hover:border-zinc-300 dark:border-zinc-800 hover:dark:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
                id={`btn-net-mode-${m.id}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{m.label}</span>
                  {networkStatus === m.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-white animate-ping" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Global Stats Panel */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-1">Decentralized Coverage</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-sans text-zinc-900 dark:text-white">{onlineCount}/{nodes.length}</span>
              <span className="text-xs text-emerald-500 font-medium">Nodes</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Active transmission paths</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-1">Populations Connected</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-sans text-zinc-900 dark:text-white">{totalUsers}</span>
              <span className="text-xs text-indigo-500 font-medium">Peers</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Active devices in local grid</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-1">Solar Resiliency</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-sans text-zinc-900 dark:text-white">{avgBattery}%</span>
              <span className="text-xs text-amber-500 font-medium">Power</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Cooperative battery average</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-1">Global Failover Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${networkStatus === 'offline' ? 'bg-zinc-400' : 'bg-emerald-500'}`} />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono uppercase">
                {networkStatus === 'online' ? 'Fiber Path' : networkStatus === 'satellite' ? 'Satellite Auto-Active' : networkStatus === 'mesh' ? 'Mesh Self-Healing' : 'Offline Buffer'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Zero-trust architecture</p>
          </div>
        </div>
      </div>

      {/* SkyMesh Interactive Map and Telemetry Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Global Mesh Map Layout */}
        <div className="lg:col-span-2 p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e1b4b 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-zinc-500" />
                SkyMesh Live Network topology
              </h3>
              <p className="text-[11px] text-zinc-400">Solar mesh clusters, geostationary uplinks, and mesh hopping lines</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleOptimize} 
                disabled={isOptimizing}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 hover:dark:bg-zinc-800 disabled:opacity-50 flex items-center gap-1"
                id="btn-optimize-mesh"
              >
                <Cpu className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                Optimize with AI Routing
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center gap-1"
                id="btn-trigger-add-node"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Relay
              </button>
            </div>
          </div>

          {/* Map canvas container */}
          <div className="relative w-full h-[320px] border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-zinc-100 dark:bg-zinc-950 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Failover routing line animation overlays */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {nodes.map((node) => {
                if (node.status === 'offline') return null;
                // Draw link to Center Uplink (node-1) to create standard topological representation
                const centerNode = nodes.find(n => n.id === 'node-1');
                if (centerNode && node.id !== 'node-1') {
                  const strokeColor = node.status === 'warning' ? '#eab308' : '#6366f1';
                  return (
                    <g key={`link-${node.id}`}>
                      <line 
                        x1={`${node.locX}%`} 
                        y1={`${node.locY}%`} 
                        x2={`${centerNode.locX}%`} 
                        y2={`${centerNode.locY}%`} 
                        stroke={strokeColor} 
                        strokeWidth="1.5" 
                        strokeOpacity="0.4"
                        strokeDasharray={node.status === 'warning' ? '4 4' : undefined}
                      />
                      {/* Interactive ping particle animation */}
                      <circle r="3" fill={strokeColor} opacity="0.8">
                        <animateMotion 
                          dur="4s" 
                          repeatCount="indefinite" 
                          path={`M ${node.locX * 4} ${node.locY * 3} L ${centerNode.locX * 4} ${centerNode.locY * 3}`} 
                        />
                      </circle>
                    </g>
                  );
                }
                return null;
              })}
            </svg>

            {/* Interactive Nodes layer */}
            {nodes.map((node) => {
              const works = node.status !== 'offline';
              const isSelected = selectedNode?.id === node.id;
              
              let typeColor = 'bg-white text-zinc-900 border-zinc-200';
              if (node.type === 'satellite_uplink') typeColor = 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800';
              if (node.type === 'community_server') typeColor = 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800';
              if (node.status === 'warning') typeColor = 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800';
              if (node.status === 'offline') typeColor = 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-600 dark:border-zinc-800';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.locX}%`, top: `${node.locY}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full border shadow-sm transition-all z-10 hover:scale-110 flex items-center justify-center ${typeColor} ${
                    isSelected ? 'ring-4 ring-indigo-500/30 border-indigo-500 scale-105' : ''
                  }`}
                  id={`relay-node-btn-${node.id}`}
                >
                  <Wifi className="w-4 h-4" />
                  
                  {/* Battery overlay indicator node circles */}
                  {works && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${node.battery < 20 ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${node.battery < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </span>
                  )}

                  {/* Label tooltip for accessibility */}
                  <span className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all block font-mono">
                    {node.name}
                  </span>
                </button>
              );
            })}

            {/* Float optimizer feedback */}
            {optMessage && (
              <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/95 border border-zinc-800 text-emerald-400 p-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono backdrop-blur-md z-30">
                <Sliders className="w-4 h-4 animate-spin text-emerald-500" />
                <span>{optMessage}</span>
              </div>
            )}

            {/* Offline-mode blackout banner */}
            {networkStatus === 'offline' && (
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[1px] pointer-events-none z-20 flex items-center justify-center">
                <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 shadow-lg">
                  <WifiOff className="w-4 h-4 text-zinc-500" />
                  <span>Viewing historical cluster snapshot (Offline mode)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Node Details or Add Relay Form inside right side panel */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
          {showAddForm ? (
            <div className="space-y-4 font-sans" id="relay-add-container">
              {/* Add Custom scan laser inline style keyframe definitions safely */}
              <style>{`
                @keyframes qr-laser-sweep {
                  0% { top: 0%; opacity: 0.6; }
                  50% { top: 100%; opacity: 1; }
                  100% { top: 0%; opacity: 0.6; }
                }
                .sweep-laser {
                  animation: qr-laser-sweep 2.2s infinite linear;
                }
              `}</style>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-indigo-500 animate-[pulse_1.5s_infinite]" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Register Hardware</h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setShowAddForm(false); handleStopCamera(); }}
                  className="text-xs text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
              </div>

              {/* Mode segmented control switcher */}
              <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl text-xs font-semibold">
                <button 
                  type="button"
                  onClick={() => { setAddMode('qr'); handleStopCamera(); }}
                  className={`grow py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    addMode === 'qr' 
                      ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-900 dark:text-white border border-zinc-250/20' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                  id="tab-qr-mode"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  QR Scan Mode
                </button>
                <button 
                  type="button"
                  onClick={() => { setAddMode('manual'); handleStopCamera(); }}
                  className={`grow py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    addMode === 'manual' 
                      ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-900 dark:text-white border border-zinc-250/20' 
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                  id="tab-manual-mode"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Manual Config
                </button>
              </div>

              {addMode === 'qr' ? (
                <div className="space-y-4" id="mesh-qr-scanner-workspace">
                  {/* Visual Viewport frame box */}
                  <div className="relative aspect-video rounded-xl border border-zinc-255 dark:border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
                    {/* Viewport ambient crosshairs graphics */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />

                    {cameraActive ? (
                      <div className="w-full h-full relative">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover opacity-80"
                        />
                        <button 
                          onClick={handleStopCamera}
                          className="absolute bottom-2 right-2 bg-zinc-900/80 hover:bg-zinc-900 text-white rounded-lg px-2 py-1 text-[10px] uppercase font-mono border border-zinc-800"
                        >
                          Disable Feed
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4 text-zinc-500 space-y-1.5">
                        <Camera className="w-7 h-7 mx-auto text-zinc-700 dark:text-zinc-500 animate-pulse" />
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Scanner Viewport Idle</p>
                        <p className="text-[9px] text-zinc-550 max-w-[200px] leading-relaxed mx-auto">Launch webcam feeds or select a hardware preset below.</p>
                        <button
                          type="button"
                          onClick={handleStartCamera}
                          className="mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-indigo-400 border border-indigo-900/45 hover:bg-indigo-950/20 rounded-md transition-colors"
                        >
                          Enable Physical Camera
                        </button>
                      </div>
                    )}

                    {/* Animated Holographic sweeping scan line */}
                    {(cameraActive || qrScanning) && (
                      <div className="absolute inset-x-0 h-[1.5px] bg-emerald-400 shadow-[0_0_8px_#10b981] sweep-laser pointer-events-none" />
                    )}

                    {/* Pending decoding labels overlay */}
                    {qrScanning && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mb-2" />
                        <p className="text-xs font-mono text-emerald-400 animate-pulse">{qrMessage}</p>
                        <span className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">HOLOGRAPHIC DIAGNOSTICS ACTIVE</span>
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-150 dark:border-zinc-800 rounded-lg text-[9px] font-mono text-zinc-500 leading-normal">
                      Note: {cameraError}
                    </div>
                  )}

                  {/* Scanned Data Results Display */}
                  {scannedResult ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-900/30 pb-2">
                        <span className="text-[10px] uppercase font-mono font-bold text-emerald-805 dark:text-emerald-400 tracking-wide flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Validated Hardware Node Certificate
                        </span>
                        <button 
                          onClick={() => setScannedResult(null)}
                          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-450 dark:text-zinc-505 block">Hardware Name</span>
                          <span className="font-semibold text-zinc-950 dark:text-white">{scannedResult.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-450 dark:text-zinc-505 block">Category</span>
                          <span className="font-mono uppercase tracking-wide text-zinc-850 dark:text-zinc-200">{scannedResult.type.replace('_', ' ')}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-450 dark:text-zinc-505 block">Battery Health</span>
                          <span className="font-semibold text-zinc-950 dark:text-white">{scannedResult.battery}% Cells Ready</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-450 dark:text-zinc-505 block">RSSI Sync Signal</span>
                          <span className="font-semibold text-zinc-950 dark:text-white">{scannedResult.signal}% Peak</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRegisterScannedNode}
                        className="w-full text-xs font-bold py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Register Scanned Node to Topology
                      </button>
                    </div>
                  ) : (
                    /* Preset scanning simulators */
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">Preset Hardware Scan Simulation</span>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => handlePresetScan('High-Gain Solar Pod', 'solar', 100, 95, 30)}
                            className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-zinc-900 dark:text-white block truncate">High-Gain Solar Relay Pod (SL-X9)</span>
                              <span className="text-[9px] font-mono text-zinc-400">Class: Solar Mesh • Decoded Signal: 95%</span>
                            </div>
                            <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePresetScan('Cooperative Cloud Vault', 'community_server', 100, 88, 55)}
                            className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-zinc-900 dark:text-white block truncate">Local Cache Community Vault (CS-U5)</span>
                              <span className="text-[9px] font-mono text-zinc-400">Class: Micro-Server • Decoded Signal: 88%</span>
                            </div>
                            <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePresetScan('Air Swarm Linker', 'drone_repeater', 78, 70, 25)}
                            className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-zinc-900 dark:text-white block truncate">Air Swarm Aerial Repeater (DS-X9)</span>
                              <span className="text-[9px] font-mono text-zinc-400">Class: Drone Linker • Decoded Signal: 70%</span>
                            </div>
                            <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                          </button>
                        </div>
                      </div>

                      {/* File Qr Dropper Upload panel */}
                      <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-center bg-zinc-50/50 dark:bg-zinc-950/30">
                        <label className="cursor-pointer block">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleQrFileUpload}
                            className="hidden" 
                          />
                          <p className="text-[10px] text-zinc-400 font-sans">
                            Or <span className="text-indigo-500 font-semibold underline">upload QR image code</span> directly to ingest signature key configurations
                          </p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddNode} className="space-y-3" id="form-add-relay">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 tracking-wider uppercase mb-1">Grid/Node Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. West Valley School"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg focus:outline-hidden focus:border-indigo-500 text-zinc-900 dark:text-zinc-100"
                      id="input-new-node-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 tracking-wider uppercase mb-1">Transmission Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-zinc-900 dark:text-zinc-100"
                      id="select-new-node-type"
                    >
                      <option value="solar">Solar-powered Mesh</option>
                      <option value="satellite_uplink">Satellite Ground Station</option>
                      <option value="community_server">Local Cache Server</option>
                      <option value="drone_repeater">Aerial Swarm Link</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 tracking-wider uppercase mb-1">Initial Battery (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={newBattery}
                        onChange={(e) => setNewBattery(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-zinc-900 dark:text-zinc-100"
                        id="input-new-node-battery"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 tracking-wider uppercase mb-1">Signal (dBm/%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={newSignal}
                        onChange={(e) => setNewSignal(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-zinc-900 dark:text-zinc-100"
                        id="input-new-node-signal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-xs font-semibold py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
                    id="btn-submit-add-node"
                  >
                    Provision & Connect Relay
                  </button>
                </form>
              )}
            </div>
          ) : selectedNode ? (
            <div className="space-y-6" id="telemetry-panel">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedNode.status === 'online' ? 'bg-emerald-500' : selectedNode.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Device Telemetry Status</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{selectedNode.name}</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-mono mt-0.5">
                  Type: {selectedNode.type.replace('_', ' ')}
                </p>
              </div>

              {/* Graphical battery and signals indicators */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
                    <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-zinc-500" /> Storage Cells Battery</span>
                    <span className="font-mono font-medium">{selectedNode.battery}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        selectedNode.battery < 20 ? 'bg-rose-500' : selectedNode.battery < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedNode.battery}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-1">Solar collection is auto-regulated via localized BMS models.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
                    <span className="flex items-center gap-1"><Signal className="w-3.5 h-3.5 text-zinc-500" /> RSSI Signal Quality</span>
                    <span className="font-mono font-medium">{selectedNode.signal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${selectedNode.signal}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono block">Connected Users</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{selectedNode.activeUsers} devices</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono block">Current Throttle</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{selectedNode.bandwidth} Mbps</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-zinc-400 font-mono block">Last P2P Synced timestamp</span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{selectedNode.lastSync}</span>
                </div>
              </div>

              {selectedNode.battery < 20 && selectedNode.status !== 'offline' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex gap-2 text-amber-800 dark:text-amber-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Severe battery drain detected</p>
                    <p className="text-[10px] opacity-90 mt-0.5">Prepare governance proposal to allocate dynamic grid energy modifiers or request immediate physical Drone payload inspection.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-12">
              <Eye className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs">Select any node on the topology map to observe real-time telemetry diagnostics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
